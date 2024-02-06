import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';
import { useAuth } from '@teams/Contexts/AuthContext';

import { removeUserFromTeam } from '@teams/Functions/Team/Users';
import { updateUserRole } from '@teams/Functions/User/Roles';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';
import {
	addUserToStore,
	removeUserFromStore,
} from '@teams/Functions/Team/Stores/User';

import Header from '@components/Header';
import Loading from '@components/Loading';

import {
	PickerContainer,
	Picker,
} from '@teams/Components/Product/Inputs/Pickers/styles';

import {
	Container,
	PageContent,
	UserName,
	UserInfo,
	CodeDetails,
	CodeTitle,
	CodeContainer,
	Code,
	SettingContainer,
	SettingTitle,
	SettingDescription,
	RoleText,
	RadioButtonGroup,
	RadioButtonItem,
} from './styles';

interface UserDetailsProps {
	route: {
		params: {
			user: string;
		};
	};
}

const UserDetails: React.FC<UserDetailsProps> = ({
	route,
}: UserDetailsProps) => {
	const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const authContext = useAuth();
	const teamContext = useTeam();

	const [isMounted, setIsMounted] = useState(true);

	const user: IUserInTeam = useMemo(() => {
		return JSON.parse(String(route.params.user));
	}, [route.params.user]);

	const isMyself = useMemo(
		() => user.fid === authContext.user?.uid,
		[authContext.user, user.fid]
	);

	const [stores, setStores] = useState<IPickerItem[]>([]);

	const [selectedRole, setSelectedRole] = useState<
		'repositor' | 'supervisor' | 'manager'
	>(() => {
		if (user.role) {
			const role = user.role.toLowerCase();

			if (role === 'manager') {
				return 'manager';
			}
			if (role === 'supervisor') {
				return 'supervisor';
			}
		}
		return 'repositor';
	});

	const [selectedStore, setSelectedStore] = useState<string | null>(() => {
		if (user.stores && user.stores.length > 0) {
			return user.stores[0].id;
		}
		return null;
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const loadData = useCallback(async () => {
		if (!isMounted || !teamContext.id) return;
		try {
			setIsLoading(true);

			const allStores = await getAllStoresFromTeam({
				team_id: teamContext.id,
			});

			const storesToAdd: IPickerItem[] = [];
			allStores.forEach(store => {
				storesToAdd.push({
					key: store.id,
					value: store.id,
					label: store.name,
				});
			});

			setStores(storesToAdd);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [isMounted, teamContext.id]);

	const handleOnChange = useCallback((value: string) => {
		setSelectedStore(value);
	}, []);

	const enableManagerTools = useMemo(() => {
		if (teamContext.id) {
			if (teamContext.roleInTeam?.role.toLowerCase() === 'manager') {
				return true;
			}
		}
		return false;
	}, [teamContext.id, teamContext.roleInTeam]);

	const userIsPending = useMemo(() => {
		if (user.status) {
			if (user.status.toLowerCase() === 'pending') {
				return true;
			}
		}
		return false;
	}, [user.status]);

	const userRole = useMemo(() => {
		if (user.role) {
			const { role } = user;

			if (role?.toLowerCase() === 'manager')
				return strings.UserInfo_Role_Manager;
			if (role?.toLowerCase() === 'supervisor') {
				return strings.UserInfo_Role_Supervisor;
			}
		}

		return strings.UserInfo_Role_Repositor;
	}, [user]);

	const handleCopyCode = useCallback(() => {
		Clipboard.setString(user.code);

		showMessage({
			message: 'Código copiado para área de transferencia',
			type: 'info',
		});
	}, [user.code]);

	const handleRemoveUser = useCallback(async () => {
		if (!isMounted || !teamContext.id) return;

		try {
			setIsLoading(true);
			await removeUserFromTeam({
				team_id: teamContext.id,
				user_id: user.id,
			});

			showMessage({
				message: 'Usuário removido do time',
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [isMounted, pop, teamContext.id, user.id]);

	const handleUpdate = useCallback(async () => {
		if (!isMounted || !teamContext.id) return;

		try {
			setIsLoading(true);
			if (user.stores.length > 0) {
				if (selectedStore === null) {
					await removeUserFromStore({
						team_id: teamContext.id,
						store_id: user.stores[0].id,
						user_id: user.id,
					});
				}
			}

			if (selectedStore !== null) {
				if (
					user.stores.length <= 0 ||
					selectedStore !== user.stores[0].id
				)
					await addUserToStore({
						team_id: teamContext.id,
						user_id: user.id,
						store_id: selectedStore,
					});
			}

			await updateUserRole({
				user_id: user.id,
				team_id: teamContext.id,
				newRole: selectedRole,
			});

			showMessage({
				message: 'Usuário atualizado',
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [isMounted, pop, selectedRole, selectedStore, teamContext.id, user]);

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		return () => {
			setIsMounted(false);
		};
	}, []);

	const enableManager = useMemo(() => {
		if (enableManagerTools && authContext.user && !isMyself) {
			return true;
		}
		return false;
	}, []);

	const handleOnRoleChange = useCallback((value: string) => {
		if (value.toLowerCase() === 'supervisor') {
			setSelectedRole('supervisor');
			return;
		}

		setSelectedRole('repositor');
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_UserDetails_PageTitle}
				noDrawer
				appBarActions={
					enableManager
						? [
								{
									icon: 'content-save-outline',
									onPress: handleUpdate,
								},
						  ]
						: []
				}
				moreMenuItems={
					enableManager
						? [
								{
									title: 'Remover',
									leadingIcon: 'account-minus-outline',
									onPress: handleRemoveUser,
								},
						  ]
						: []
				}
			/>

			<PageContent>
				{!!user.name && !!user.lastName && (
					<UserName>{`${user.name} ${user.lastName}`}</UserName>
				)}

				<UserInfo>{user.email}</UserInfo>
				<UserInfo>{userRole}</UserInfo>

				{userIsPending && enableManagerTools && (
					<CodeDetails>
						<CodeTitle>
							{strings.View_UserDetails_Code_Title}
						</CodeTitle>
						<CodeContainer onPress={handleCopyCode}>
							<Code>{user.code}</Code>
						</CodeContainer>
					</CodeDetails>
				)}

				{enableManagerTools &&
					authContext.user &&
					!isMyself &&
					!userIsPending && (
						<>
							<PickerContainer style={{ marginTop: 10 }}>
								<Picker
									items={stores}
									onValueChange={handleOnChange}
									value={selectedStore}
									placeholder={{
										label: 'Atribuir a uma loja',
										value: null,
									}}
								/>
							</PickerContainer>

							<SettingContainer>
								<SettingTitle>
									Escolha o cargo do usuário
								</SettingTitle>

								<SettingDescription>
									Escolha com base nas responsabilidades dos
									usuários.
								</SettingDescription>

								<SettingDescription>
									<RoleText>Repositor</RoleText>: gerencie
									produtos com acesso básico.
								</SettingDescription>
								<SettingDescription>
									<RoleText>Supervisor</RoleText>: controle
									completo, incluindo exclusão de produtos.
								</SettingDescription>

								<RadioButtonGroup
									onValueChange={handleOnRoleChange}
									value={selectedRole}
								>
									<RadioButtonItem
										label="Repositor"
										value="repositor"
									/>
									<RadioButtonItem
										label="Supervisor"
										value="supervisor"
									/>
								</RadioButtonGroup>
							</SettingContainer>
						</>
					)}
			</PageContent>
		</Container>
	);
};

export default UserDetails;
