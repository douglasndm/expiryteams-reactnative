import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { deleteBrand, getAllBrands, updateBrand } from '~/Functions/Brand';

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
    brand_id: string;
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

            const response = await getAllBrands({
                team_id: teamContext.id,
            });

            const brand = response.find(b => b.id === routeParams.brand_id);

            if (brand) setName(brand.name);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.brand_id, teamContext.id]);

    useEffect(() => {
        loadData();
    }, []);

    const onNameChange = useCallback(value => {
        setErrorName('');
        setName(value);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (!name) {
            setErrorName('Digite o nome da marca');
            return;
        }

        await updateBrand({
            id: routeParams.brand_id,
            name,
        });

        showMessage({
            message: 'Marca atualizada',
            type: 'info',
        });

        reset({
            routes: [
                { name: 'Home' },
                {
                    name: 'BrandList',
                },
            ],
        });
    }, [name, routeParams.brand_id, reset]);

    const handleDeleteBrand = useCallback(async () => {
        try {
            await deleteBrand({
                brand_id: routeParams.brand_id,
            });

            showMessage({
                message: 'A marca foi apagada',
                type: 'info',
            });

            reset({
                routes: [
                    { name: 'Home' },
                    {
                        name: 'BrandList',
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
    }, [reset, routeParams.brand_id]);

    const handleSwitchDeleteVisible = useCallback(() => {
        setDeleteComponentVisible(!deleteComponentVisible);
    }, [deleteComponentVisible]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <Header title={strings.View_Brand_Edit_PageTitle} noDrawer />

                <Content>
                    <InputTextContainer hasError={!!errorName}>
                        <InputText
                            placeholder={
                                strings.View_Brand_Edit_InputNamePlaceholder
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
                            {strings.View_Brand_Edit_ButtonSave}
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
                    {strings.View_Brand_Edit_DeleteModal_Title}
                </Dialog.Title>
                <Dialog.Description>
                    {strings.View_Brand_Edit_DeleteModal_Message}
                </Dialog.Description>
                <Dialog.Button
                    label={strings.View_Brand_Edit_DeleteModal_Cancel}
                    onPress={handleSwitchDeleteVisible}
                />
                <Dialog.Button
                    label={strings.View_Brand_Edit_DeleteModal_Confirm}
                    color="red"
                    onPress={handleDeleteBrand}
                />
            </Dialog.Container>
        </>
    );
};

export default Edit;
