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

import { translate } from '~/Locales';

import {
    getCategory,
    updateCategory,
    deleteCategory,
} from '~/Functions/Categories';

import PreferencesContext from '~/Contexts/PreferencesContext';

import BackButton from '~/Components/BackButton';

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
    LoadingContainer,
    Loading,
    LoadingText,
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

    const { userPreferences } = useContext(PreferencesContext);

    const userRole = useMemo(() => {
        return userPreferences.selectedTeam.role.toLowerCase();
    }, [userPreferences.selectedTeam.role]);

    const [name, setName] = useState<string | undefined>(undefined);
    const [errorName, setErrorName] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        const category = await getCategory({ category_id: routeParams.id });

        if ('error' in category) {
            showMessage({
                message: category.error,
                type: 'danger',
            });
            return;
        }

        setName(category.name);
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
            setErrorName(translate('View_Category_Edit_ErrorEmtpyName'));
            return;
        }

        const updatedCategory = await updateCategory({
            category: {
                id: routeParams.id,
                name,
            },
        });

        if ('error' in updatedCategory) {
            showMessage({
                message: updatedCategory.error,
                type: 'danger',
            });
            return;
        }

        showMessage({
            message: translate('View_Category_Edit_SuccessText'),
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
    }, [routeParams.id, name, reset]);

    return (
        <>
            <Container>
                {isLoading ? (
                    <LoadingContainer>
                        <Loading />
                        <LoadingText>
                            {translate('App_Loading_Text')}
                        </LoadingText>
                    </LoadingContainer>
                ) : (
                    <>
                        <PageHeader>
                            <PageTitleContainer>
                                <BackButton handleOnPress={goBack} />
                                <PageTitle>
                                    {translate('View_Category_Edit_PageTitle')}
                                </PageTitle>
                            </PageTitleContainer>
                        </PageHeader>

                        <Content>
                            <InputTextContainer hasError={!!errorName}>
                                <InputText
                                    placeholder={translate(
                                        'View_Category_Edit_InputNamePlaceholder'
                                    )}
                                    value={name}
                                    onChangeText={onNameChange}
                                />
                            </InputTextContainer>
                            {!!errorName && (
                                <InputTextTip>{errorName}</InputTextTip>
                            )}

                            <ActionsButtonContainer>
                                <ButtonPaper
                                    icon={() => (
                                        <Icons name="save-outline" size={22} />
                                    )}
                                    onPress={handleUpdate}
                                >
                                    {translate('View_Category_Edit_ButtonSave')}
                                </ButtonPaper>

                                {(userRole === 'manager' ||
                                    userRole === 'supervisor') && (
                                    <ButtonPaper
                                        icon={() => (
                                            <Icons
                                                name="trash-outline"
                                                size={22}
                                            />
                                        )}
                                        onPress={() => {
                                            setDeleteComponentVisible(true);
                                        }}
                                    >
                                        {translate(
                                            'View_ProductDetails_Button_DeleteProduct'
                                        )}
                                    </ButtonPaper>
                                )}

                                <ButtonPaper
                                    icon={() => (
                                        <Icons name="exit-outline" size={22} />
                                    )}
                                    onPress={goBack}
                                >
                                    {translate(
                                        'View_EditProduct_Button_Cancel'
                                    )}
                                </ButtonPaper>
                            </ActionsButtonContainer>
                        </Content>
                    </>
                )}
            </Container>
            <DialogPaper
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
            >
                <DialogPaper.Title style={{ color: theme.colors.text }}>
                    {translate('View_Category_Edit_DeleteModal_Title')}
                </DialogPaper.Title>
                <DialogPaper.Content>
                    <Text>
                        {translate('View_Category_Edit_DeleteModal_Message')}
                    </Text>
                </DialogPaper.Content>
                <DialogPaper.Actions>
                    <Button color="red" onPress={handleDeleteCategory}>
                        {translate('View_Category_Edit_DeleteModal_Confirm')}
                    </Button>
                    <Button
                        color={theme.colors.accent}
                        onPress={() => {
                            setDeleteComponentVisible(false);
                        }}
                    >
                        {translate('View_Category_Edit_DeleteModal_Cancel')}
                    </Button>
                </DialogPaper.Actions>
            </DialogPaper>
        </>
    );
};

export default Edit;
