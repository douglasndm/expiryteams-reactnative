import React, {
    useCallback,
    useState,
    useEffect,
    useContext,
    useMemo,
} from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { Button } from 'react-native-paper';
import { useTheme } from 'styled-components/native';

import strings from '~/Locales';

import {
    getCategory,
    updateCategory,
    deleteCategory,
} from '~/Functions/Categories';

import PreferencesContext from '~/Contexts/PreferencesContext';

import BackButton from '~/Components/BackButton';
import Loading from '~/Components/Loading';

import { PageHeader, PageTitle } from '~/Views/Product/Add/styles';
import {
    ActionsButtonContainer,
    ButtonPaper,
    Icons,
    DialogPaper,
    Text,
} from '~/Views/Product/Edit/styles';

import {
    Container,
    Content,
    PageTitleContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
} from './styles';

interface Props {
    id: string;
}
const Edit: React.FC = () => {
    const { params } = useRoute();
    const { reset, goBack } = useNavigation();
    const theme = useTheme();

    const { preferences } = useContext(PreferencesContext);

    const userRole = useMemo(() => {
        if (preferences.selectedTeam) {
            return preferences.selectedTeam.role.toLowerCase();
        }
        return 'repositor';
    }, [preferences.selectedTeam]);

    const [name, setName] = useState<string | undefined>(undefined);
    const [errorName, setErrorName] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const routeParams = params as Props;

    const handleDeleteCategory = useCallback(async () => {
        try {
            setIsLoading(true);
            await deleteCategory({ category_id: routeParams.id });

            reset({
                routes: [
                    {
                        name: 'Home',
                    },
                    { name: 'ListCategory' },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.id, reset]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const category = await getCategory({ category_id: routeParams.id });

            setName(category.name);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onNameChange = useCallback(value => {
        setErrorName('');
        setName(value);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (!name) {
            setErrorName(strings.View_Category_Edit_ErrorEmtpyName);
            return;
        }

        try {
            setIsLoading(true);

            await updateCategory({
                category: {
                    id: routeParams.id,
                    name,
                },
            });

            showMessage({
                message: strings.View_Category_Edit_SuccessText,
                type: 'info',
            });

            reset({
                routes: [
                    { name: 'Home' },
                    {
                        name: 'ListCategory',
                    },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.id, name, reset]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <PageHeader>
                    <PageTitleContainer>
                        <BackButton handleOnPress={goBack} />
                        <PageTitle>
                            {strings.View_Category_Edit_PageTitle}
                        </PageTitle>
                    </PageTitleContainer>

                    <ActionsButtonContainer>
                        <ButtonPaper
                            icon={() => <Icons name="save-outline" size={22} />}
                            onPress={handleUpdate}
                        >
                            {strings.View_Category_Edit_ButtonSave}
                        </ButtonPaper>

                        {(userRole === 'manager' ||
                            userRole === 'supervisor') && (
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="trash-outline" size={22} />
                                )}
                                onPress={() => {
                                    setDeleteComponentVisible(true);
                                }}
                            >
                                {
                                    strings.View_ProductDetails_Button_DeleteProduct
                                }
                            </ButtonPaper>
                        )}
                    </ActionsButtonContainer>
                </PageHeader>

                <Content>
                    <InputTextContainer hasError={!!errorName}>
                        <InputText
                            placeholder={
                                strings.View_Category_Edit_InputNamePlaceholder
                            }
                            value={name}
                            onChangeText={onNameChange}
                        />
                    </InputTextContainer>
                    {!!errorName && <InputTextTip>{errorName}</InputTextTip>}
                </Content>
            </Container>
            <DialogPaper
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
            >
                <DialogPaper.Title style={{ color: theme.colors.text }}>
                    {strings.View_Category_Edit_DeleteModal_Title}
                </DialogPaper.Title>
                <DialogPaper.Content>
                    <Text>
                        {strings.View_Category_Edit_DeleteModal_Message}
                    </Text>
                </DialogPaper.Content>
                <DialogPaper.Actions>
                    <Button color="red" onPress={handleDeleteCategory}>
                        {strings.View_Category_Edit_DeleteModal_Confirm}
                    </Button>
                    <Button
                        color={theme.colors.accent}
                        onPress={() => {
                            setDeleteComponentVisible(false);
                        }}
                    >
                        {strings.View_Category_Edit_DeleteModal_Cancel}
                    </Button>
                </DialogPaper.Actions>
            </DialogPaper>
        </>
    );
};

export default Edit;
