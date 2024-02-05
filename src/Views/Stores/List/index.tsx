import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '@teams/Contexts/TeamContext';

import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';
import { createStore } from '@teams/Functions/Team/Stores/Create';

import Header from '@components/Header';
import Loading from '@components/Loading';

import {
	Container,
	InputContainer,
	InputTextContainer,
	InputText,
	ListTitle,
	Icons,
	LoadingIcon,
	InputTextTip,
	ListItemContainer,
	ListItemTitle,
	AddButtonContainer,
	AddNewItemContent,
	Content,
} from '@styles/Views/GenericListPage';

const ListView: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [stores, setStores] = useState<Array<IStore>>([]);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [newStoreName, setNewStoreName] = useState<string | undefined>();
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [inputHasError, setInputHasError] = useState<boolean>(false);
	const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

	const isManager = useMemo(() => {
		if (teamContext.roleInTeam) {
			const role = teamContext.roleInTeam.role.toLowerCase();
			if (role === 'manager') {
				return true;
			}
		}
		return false;
	}, [teamContext.roleInTeam]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			setIsLoading(true);

			const response = await getAllStoresFromTeam({
				team_id: teamContext.id,
			});

			setStores(response);
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
	}, [loadData]);

	const handleOnTextChange = useCallback((value: string) => {
		setInputHasError(false);
		setInputErrorMessage('');
		setNewStoreName(value);
	}, []);

	const handleSave = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			if (!newStoreName) {
				setInputHasError(true);
				setInputErrorMessage('Digite o nome da loja');
				return;
			}

			setIsAdding(true);

			const store = await createStore({
				name: newStoreName,
				team_id: teamContext.id,
			});

			setStores([...stores, store]);
			setNewStoreName('');
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsAdding(false);
		}
	}, [newStoreName, stores, teamContext.id]);

	const handleNavigateToStore = useCallback(
		(store_id: string, store_name: string) => {
			navigate('StoreView', {
				store_id,
				store_name,
			});
		},
		[navigate]
	);

	return (
		<Container>
			<Header title="Lojas" />

			{isLoading ? (
				<Loading />
			) : (
				<Content>
					{isManager && (
						<AddNewItemContent>
							<InputContainer>
								<InputTextContainer hasError={inputHasError}>
									<InputText
										value={newStoreName}
										onChangeText={handleOnTextChange}
										placeholder="Adicionar nova loja"
									/>
								</InputTextContainer>

								<AddButtonContainer
									onPress={handleSave}
									disabled={isAdding}
								>
									{isAdding ? (
										<LoadingIcon />
									) : (
										<Icons name="add-circle-outline" />
									)}
								</AddButtonContainer>
							</InputContainer>

							{!!inputErrorMessage && (
								<InputTextTip>{inputErrorMessage}</InputTextTip>
							)}
						</AddNewItemContent>
					)}

					<ListTitle>Todas as lojas</ListTitle>

					{stores.map(store => {
						return (
							<ListItemContainer
								key={store.id}
								onPress={() =>
									handleNavigateToStore(store.id, store.name)
								}
							>
								<ListItemTitle>{store.name}</ListItemTitle>
							</ListItemContainer>
						);
					})}
				</Content>
			)}
		</Container>
	);
};

export default ListView;
