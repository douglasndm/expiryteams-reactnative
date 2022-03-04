import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllStoresFromTeam } from '~/Functions/Team/Stores/AllStores';
import { updateStore } from '~/Functions/Team/Stores/Update';
import { deleteStore } from '~/Functions/Team/Stores/Delete';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';

import {
    Container,
    Content,
    ActionsButtonContainer,
    ButtonPaper,
    InputTextContainer,
    InputText,
    InputTextTip,
    Icons,
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

    const onNameChange = useCallback(value => {
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

    const handleSwitchDeleteVisible = useCallback(() => {
        setDeleteComponentVisible(!deleteComponentVisible);
    }, [deleteComponentVisible]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <Header title={strings.View_Store_Edit_PageTitle} noDrawer />

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

                    <ActionsButtonContainer>
                        <ButtonPaper
                            icon={() => <Icons name="save-outline" size={22} />}
                            onPress={handleUpdate}
                        >
                            {strings.View_Store_Edit_ButtonSave}
                        </ButtonPaper>

                        <ButtonPaper
                            icon={() => (
                                <Icons name="trash-outline" size={22} />
                            )}
                            onPress={() => {
                                setDeleteComponentVisible(true);
                            }}
                        >
                            {strings.View_ProductDetails_Button_DeleteProduct}
                        </ButtonPaper>
                    </ActionsButtonContainer>
                </Content>
            </Container>
            <Dialog.Container
                visible={deleteComponentVisible}
                onBackdropPress={handleSwitchDeleteVisible}
            >
                <Dialog.Title>
                    {strings.View_Store_Edit_DeleteModal_Title}
                </Dialog.Title>
                <Dialog.Description>
                    {strings.View_Store_Edit_DeleteModal_Message}
                </Dialog.Description>
                <Dialog.Button
                    label={strings.View_Store_Edit_DeleteModal_Cancel}
                    onPress={handleSwitchDeleteVisible}
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
