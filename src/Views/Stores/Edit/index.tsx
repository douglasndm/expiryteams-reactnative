import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';
import { updateStore } from '@teams/Functions/Team/Stores/Update';
import { deleteStore } from '@teams/Functions/Team/Stores/Delete';

import Header from '@components/Header';
import Loading from '@components/Loading';

import {
	Container,
	Content,
	InputTextContainer,
	InputText,
	InputTextTip,
} from './styles';

interface Props {
	store_id: string;
}
const Edit: React.FC = () => {
	const { params } = useRoute();
	const { reset } = useNavigation();

	const teamContext = useTeam();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [name, setName] = useState<string | undefined>(undefined);
	const [errorName, setErrorName] = useState<string>('');

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const routeParams = params as Props;

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			setIsLoading(true);

			const response = await getAllStoresFromTeam({
				team_id: teamContext.id,
			});

			const store = response.find(sto => sto.id === routeParams.store_id);

			if (store) setName(store.name);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.store_id, teamContext.id]);

	useEffect(() => {
		loadData();
	}, []);

	const onNameChange = useCallback((value: string) => {
		setErrorName('');
		setName(value);
	}, []);

	const handleUpdate = useCallback(async () => {
		if (!teamContext.id) return;
		if (!name) {
			setErrorName(strings.View_Store_Edit_Error_EmtpyName);
			return;
		}

		await updateStore({
			store_id: routeParams.store_id,
			team_id: teamContext.id,
			name,
		});

		showMessage({
			message: strings.View_Store_Edit_SuccessText,
			type: 'info',
		});

		reset({
			routes: [
				{ name: 'Home' },
				{
					name: 'StoreList',
				},
			],
		});
	}, [teamContext.id, name, routeParams.store_id, reset]);

	const handleDeleteBrand = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			await deleteStore({
				store_id: routeParams.store_id,
				team_id: teamContext.id,
			});

			showMessage({
				message: strings.View_Store_Success_OnDelete,
				type: 'info',
			});

			reset({
				routes: [
					{ name: 'Home' },
					{
						name: 'StoreList',
					},
				],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [reset, routeParams.store_id, teamContext.id]);

	const handleSwitchShowDelete = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<>
			<Container>
				<Header
					title={strings.View_Store_Edit_PageTitle}
					noDrawer
					appBarActions={[
						{
							icon: 'content-save-outline',
							onPress: handleUpdate,
						},
					]}
					moreMenuItems={[
						{
							title: strings.View_ProductDetails_Button_DeleteProduct,
							leadingIcon: 'trash-can-outline',
							onPress: handleSwitchShowDelete,
						},
					]}
				/>

				<Content>
					<InputTextContainer hasError={!!errorName}>
						<InputText
							placeholder={
								strings.View_Store_Edit_InputNamePlaceholder
							}
							value={name}
							onChangeText={onNameChange}
						/>
					</InputTextContainer>
					{!!errorName && <InputTextTip>{errorName}</InputTextTip>}
				</Content>
			</Container>
			<Dialog.Container
				visible={deleteComponentVisible}
				onBackdropPress={handleSwitchShowDelete}
			>
				<Dialog.Title>
					{strings.View_Store_Edit_DeleteModal_Title}
				</Dialog.Title>
				<Dialog.Description>
					{strings.View_Store_Edit_DeleteModal_Message}
				</Dialog.Description>
				<Dialog.Button
					label={strings.View_Store_Edit_DeleteModal_Cancel}
					onPress={handleSwitchShowDelete}
				/>
				<Dialog.Button
					label={strings.View_Store_Edit_DeleteModal_Confirm}
					color="red"
					onPress={handleDeleteBrand}
				/>
			</Dialog.Container>
		</>
	);
};

export default Edit;
