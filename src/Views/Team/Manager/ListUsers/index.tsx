import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import Header from '@components/Header';
import Loading from '@components/Loading';
import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllUsersFromTeam, putUserInTeam } from '~/Functions/Team/Users';

import {
	Container,
	InputContainer,
	InputTextContainer,
	InputText,
	ListCategories,
	ListTitle,
	TeamItemContainer,
	UserInfoContainer,
	TeamItemTitle,
	UserEmail,
	TeamItemRole,
	AddCategoryContent,
	AddCategoryButtonContainer,
	Icons,
	LoadingIcon,
	InputTextTip,
} from './styles';

const ListUsers: React.FC = () => {
	const { navigate, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [isMounted, setIsMounted] = useState(true);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const role = useMemo(() => {
		if (teamContext.id) {
			return teamContext.roleInTeam?.role.toLowerCase();
		}
		return 'repositor';
	}, [teamContext.id, teamContext.roleInTeam]);

	const [newUserEmail, setNewUserEmail] = useState<string | undefined>();
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [inputHasError, setInputHasError] = useState<boolean>(false);
	const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

	const [users, setUsers] = useState<Array<IUserInTeam>>([]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) {
			showMessage({
				message: 'Team is not selected',
				type: 'danger',
			});
			return;
		}

		try {
			setIsLoading(true);
			const roles = await getAllUsersFromTeam({
				team_id: teamContext.id,
			});

			const sorted = roles.sort((role1, role2) => {
				const r1 = role1.role.toLowerCase();
				const r2 = role2.role.toLowerCase();

				const name1 = role1.name?.toLowerCase().trim();
				const name2 = role2.name?.toLowerCase().trim();

				if (!name1 && name2) {
					return 1;
				}
				if (name1 && !name2) {
					return -1;
				}

				if (r1 === 'manager' && r2 !== 'manager') {
					return -1;
				}
				if (r1 !== 'manager' && r2 === 'manager') {
					return 1;
				}

				if (r1 === 'supervisor' && r2 !== 'supervisor') {
					return -1;
				}
				if (r1 !== 'supervisor' && r2 === 'supervisor') {
					return 1;
				}

				if (name1 && name2) {
					if (name1 > name2) {
						return 1;
					}
					if (name1 < name2) {
						return -1;
					}
				}
				return 0;
			});

			setUsers(sorted);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [teamContext.id]);

	useEffect(() => {
		loadData();
	}, []);

	const handleOnTextChange = useCallback((value: string) => {
		setInputHasError(false);
		setInputErrorMessage('');
		setNewUserEmail(value.trim());
	}, []);

	const handleAddUser = useCallback(async () => {
		if (!isMounted || !teamContext.id) return;

		try {
			if (!newUserEmail) {
				setInputHasError(true);
				setInputErrorMessage(
					strings.View_UsersInTeam_List_InputEmail_Error_EmptyText
				);
				return;
			}
			setIsAdding(true);

			const userInTeam = await putUserInTeam({
				user_email: newUserEmail,
				team_id: teamContext.id,
			});

			const newUser: IUserInTeam = {
				id: userInTeam.user.id,
				fid: userInTeam.user.firebaseUid,
				name: userInTeam.user.name,
				lastName: userInTeam.user.lastName,
				email: userInTeam.user.email,
				role: userInTeam.role,
				code: userInTeam.code,
				stores: [],
				status: 'Pending',
			};

			setUsers([...users, newUser]);
			setNewUserEmail('');

			showMessage({
				message:
					strings.View_UsersInTeam_List_Alert_Title_Success_UserInvited,
				description:
					strings.View_UsersInTeam_List_Alert_Description_Success_UserInvited.replace(
						'{CODE}',
						newUser.code
					),
				type: 'info',
			});
			navigate('UserDetails', { user: JSON.stringify(newUser) });
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsAdding(false);
		}
	}, [isMounted, teamContext.id, newUserEmail, users, navigate]);

	const handleNavigateToUser = useCallback(
		(user: IUserInTeam) => {
			navigate('UserDetails', { user: JSON.stringify(user) });
		},
		[navigate]
	);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return unsubscribe;
	}, [addListener, loadData]);

	useEffect(() => {
		return () => setIsMounted(false);
	}, []);

	interface renderProps {
		item: IUserInTeam;
		index: string;
	}

	const renderCategory = useCallback(
		props => {
			const params = props as renderProps;
			const { item } = params;

			const isPending =
				!!item.status && item.status.toLowerCase() === 'pending';

			return (
				<TeamItemContainer
					onPress={() => handleNavigateToUser(item)}
					isPending={isPending}
				>
					<UserInfoContainer>
						{!!item.name && (
							<TeamItemTitle>
								{item.name.trim()}{' '}
								{!!item.lastName && item.lastName.trim()}
							</TeamItemTitle>
						)}

						{!item.name && <UserEmail>{item.email}</UserEmail>}
						<TeamItemRole>
							{isPending
								? strings.View_UsersInTeam_List_PendingStatus
								: item.role.toUpperCase()}
						</TeamItemRole>
					</UserInfoContainer>
				</TeamItemContainer>
			);
		},
		[handleNavigateToUser]
	);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<Container>
					<Header title={strings.View_UsersInTeam_PageTitle} />

					{role === 'manager' && (
						<AddCategoryContent>
							<InputContainer>
								<InputTextContainer hasError={inputHasError}>
									<InputText
										value={newUserEmail}
										onChangeText={handleOnTextChange}
										keyboardType="email-address"
										autoCapitalize="none"
										placeholder={
											strings.View_UsersInTeam_Input_AddNewUser_Placeholder
										}
									/>
								</InputTextContainer>

								<AddCategoryButtonContainer
									onPress={handleAddUser}
									enabled={!isAdding}
								>
									{isAdding ? (
										<LoadingIcon />
									) : (
										<Icons name="add-circle-outline" />
									)}
								</AddCategoryButtonContainer>
							</InputContainer>

							{!!inputErrorMessage && (
								<InputTextTip>{inputErrorMessage}</InputTextTip>
							)}
						</AddCategoryContent>
					)}

					<ListTitle>{strings.View_UsersInTeam_List_Title}</ListTitle>

					<ListCategories
						data={users}
						keyExtractor={(item, index) => String(index)}
						renderItem={renderCategory}
					/>
				</Container>
			)}
		</>
	);
};

export default ListUsers;
