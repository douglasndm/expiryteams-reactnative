import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
import { exists } from 'react-native-fs';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getProduct, updateProduct } from '~/Functions/Products/Product';
import { getAllCategoriesFromTeam } from '~/Functions/Categories';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import BackButton from '~/Components/BackButton';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';
import BarCodeReader from '~/Components/BarCodeReader';
import Notification from '~/Components/Notification';

import {
    saveProductImage,
    getProductImagePath,
    getImageFileNameFromPath,
} from '~/Functions/Products/Image';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputGroup,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
    ProductImage,
    CameraButtonContainer,
    CameraButtonIcon,
    ProductImageContainer,
    MoreInformationsContainer,
    MoreInformationsTitle,
    PickerContainer,
    Picker,
} from '../Add/styles';

import {
    ButtonPaper,
    Icons,
    ActionsButtonContainer,
    DialogPaper,
    Text,
} from './styles';

interface RequestParams {
    route: {
        params: {
            productId: string;
        };
    };
}

interface ICategoryItem {
    label: string;
    value: string;
    key: string;
}

const Edit: React.FC<RequestParams> = ({ route }: RequestParams) => {
    const { userPreferences } = useContext(PreferencesContext);

    const { productId } = route.params;

    const { reset, goBack } = useNavigation();
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState<string | undefined>('');
    const [photoPath, setPhotoPath] = useState<string>('');
    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getProduct({ productId });

            if ('error' in response) {
                showMessage({
                    message: response.error,
                    type: 'danger',
                });
                return;
            }

            setName(response.name);
            setCode(response.code);

            const categoriesResponse = await getAllCategoriesFromTeam({
                team_id: userPreferences.selectedTeam.team.id,
            });

            if ('error' in categoriesResponse) {
                showMessage({
                    message: categoriesResponse.error,
                    type: 'danger',
                });
                return;
            }

            const categoriesArray: Array<ICategoryItem> = [];
            categoriesResponse.forEach(cat =>
                categoriesArray.push({
                    key: cat.id,
                    label: cat.name,
                    value: cat.id,
                })
            );
            setCategories(categoriesArray);
        } catch (err) {
            showMessage({
                message: err.message,
            });
        } finally {
            setIsLoading(false);
        }
    }, [productId, userPreferences.selectedTeam.team.id]);

    const updateProd = useCallback(async () => {
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        try {
            const updatedProduct = await updateProduct({
                product: {
                    id: productId,
                    name,
                    code,
                    categories: [{ id: selectedCategory || '', name: '' }],
                },
            });

            if ('error' in updatedProduct) {
                showMessage({
                    message: updatedProduct.error,
                });
                return;
            }

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    {
                        name: 'Success',
                        params: { productId, type: 'edit_product' },
                    },
                ],
            });
        } catch (err) {
            setError(err.message);
        }
    }, [code, name, productId, reset, selectedCategory]);

    const handleOnCodeRead = useCallback((codeRead: string) => {
        setCode(codeRead);
        setIsBarCodeEnabled(false);
    }, []);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    const handleEnableCamera = useCallback(() => {
        setIsBarCodeEnabled(false);
        setIsCameraEnabled(true);
    }, []);

    const handleDisableCamera = useCallback(() => {
        setIsCameraEnabled(false);
    }, []);

    const handleEnableBarCodeReader = useCallback(() => {
        setIsCameraEnabled(false);
        setIsBarCodeEnabled(true);
    }, []);

    const handleDisableBarCodeReader = useCallback(() => {
        setIsBarCodeEnabled(false);
    }, []);

    const handleCategoryChange = useCallback(value => {
        setSelectedCategory(value);
    }, []);

    const onPhotoTaked = useCallback(
        async ({ fileName, filePath }: onPhotoTakedProps) => {
            if (await exists(filePath)) {
                setPhotoPath(filePath);

                await saveProductImage({
                    fileName,
                    productId,
                });
            }
            handleDisableCamera();
        },
        [handleDisableCamera, productId]
    );

    const handleDeleteProduct = useCallback(async () => {
        try {
            await deleteProduct(productId);

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'Success', params: { type: 'delete_product' } },
                ],
            });
        } catch (err) {
            setError(err.message);
        }
    }, [productId, reset]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {isCameraEnabled ? (
                <Camera
                    onPhotoTaked={onPhotoTaked}
                    onBackButtonPressed={handleDisableCamera}
                />
            ) : (
                <>
                    {isBarCodeEnabled ? (
                        <BarCodeReader
                            onCodeRead={handleOnCodeRead}
                            onClose={handleDisableBarCodeReader}
                        />
                    ) : (
                        <>
                            <Container>
                                <StatusBar />
                                <PageHeader>
                                    <BackButton handleOnPress={goBack} />
                                    <PageTitle>
                                        {translate(
                                            'View_EditProduct_PageTitle'
                                        )}
                                    </PageTitle>
                                </PageHeader>

                                <PageContent>
                                    {userPreferences.isUserPremium &&
                                        !!photoPath && (
                                            <ProductImageContainer
                                                onPress={handleEnableCamera}
                                            >
                                                <ProductImage
                                                    source={{
                                                        uri: `file://${photoPath}`,
                                                    }}
                                                />
                                            </ProductImageContainer>
                                        )}

                                    <InputContainer>
                                        <InputGroup>
                                            <InputTextContainer>
                                                <InputText
                                                    placeholder={translate(
                                                        'View_EditProduct_InputPlacehoder_Name'
                                                    )}
                                                    accessibilityLabel={translate(
                                                        'View_EditProduct_InputAccessibility_Name'
                                                    )}
                                                    value={name}
                                                    onChangeText={value => {
                                                        setName(value);
                                                        setNameFieldError(
                                                            false
                                                        );
                                                    }}
                                                />
                                            </InputTextContainer>

                                            {userPreferences.isUserPremium && (
                                                <CameraButtonContainer
                                                    onPress={handleEnableCamera}
                                                >
                                                    <CameraButtonIcon />
                                                </CameraButtonContainer>
                                            )}
                                        </InputGroup>
                                        {nameFieldError && (
                                            <InputTextTip>
                                                {translate(
                                                    'View_EditProduct_Error_EmptyProductName'
                                                )}
                                            </InputTextTip>
                                        )}

                                        <InputCodeTextContainer>
                                            <InputCodeText
                                                placeholder={translate(
                                                    'View_EditProduct_InputPlacehoder_Code'
                                                )}
                                                accessibilityLabel={translate(
                                                    'View_EditProduct_InputAccessibility_Code'
                                                )}
                                                value={code}
                                                onChangeText={value =>
                                                    setCode(value)
                                                }
                                            />
                                            <InputTextIconContainer
                                                onPress={
                                                    handleEnableBarCodeReader
                                                }
                                            >
                                                <InputCodeTextIcon />
                                            </InputTextIconContainer>
                                        </InputCodeTextContainer>

                                        <MoreInformationsContainer>
                                            <MoreInformationsTitle>
                                                {translate(
                                                    'View_AddProduct_MoreInformation_Label'
                                                )}
                                            </MoreInformationsTitle>

                                            <PickerContainer
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Picker
                                                    items={categories}
                                                    onValueChange={
                                                        handleCategoryChange
                                                    }
                                                    value={selectedCategory}
                                                    placeholder={{
                                                        label: translate(
                                                            'View_AddProduct_InputPlaceholder_SelectCategory'
                                                        ),
                                                        value: 'null',
                                                    }}
                                                />
                                            </PickerContainer>
                                        </MoreInformationsContainer>

                                        <ActionsButtonContainer>
                                            <ButtonPaper
                                                icon={() => (
                                                    <Icons
                                                        name="save-outline"
                                                        size={22}
                                                    />
                                                )}
                                                onPress={updateProd}
                                            >
                                                {translate(
                                                    'View_EditProduct_Button_Save'
                                                )}
                                            </ButtonPaper>
                                            <ButtonPaper
                                                icon={() => (
                                                    <Icons
                                                        name="trash-outline"
                                                        size={22}
                                                    />
                                                )}
                                                onPress={() => {
                                                    setDeleteComponentVisible(
                                                        true
                                                    );
                                                }}
                                            >
                                                {translate(
                                                    'View_ProductDetails_Button_DeleteProduct'
                                                )}
                                            </ButtonPaper>
                                            <ButtonPaper
                                                icon={() => (
                                                    <Icons
                                                        name="exit-outline"
                                                        size={22}
                                                    />
                                                )}
                                                onPress={goBack}
                                            >
                                                {translate(
                                                    'View_EditProduct_Button_Cancel'
                                                )}
                                            </ButtonPaper>
                                        </ActionsButtonContainer>
                                    </InputContainer>
                                </PageContent>

                                {!!error && (
                                    <Notification
                                        NotificationMessage={error}
                                        NotificationType="error"
                                        onPress={handleDimissNotification}
                                    />
                                )}
                            </Container>
                            <DialogPaper
                                visible={deleteComponentVisible}
                                onDismiss={() => {
                                    setDeleteComponentVisible(false);
                                }}
                            >
                                <DialogPaper.Title
                                    style={{ color: theme.colors.text }}
                                >
                                    {translate(
                                        'View_ProductDetails_WarningDelete_Title'
                                    )}
                                </DialogPaper.Title>
                                <DialogPaper.Content>
                                    <Text>
                                        {translate(
                                            'View_ProductDetails_WarningDelete_Message'
                                        )}
                                    </Text>
                                </DialogPaper.Content>
                                <DialogPaper.Actions>
                                    <Button
                                        color="red"
                                        onPress={handleDeleteProduct}
                                    >
                                        {translate(
                                            'View_ProductDetails_WarningDelete_Button_Confirm'
                                        )}
                                    </Button>
                                    <Button
                                        color={theme.colors.accent}
                                        onPress={() => {
                                            setDeleteComponentVisible(false);
                                        }}
                                    >
                                        {translate(
                                            'View_ProductDetails_WarningDelete_Button_Cancel'
                                        )}
                                    </Button>
                                </DialogPaper.Actions>
                            </DialogPaper>
                        </>
                    )}
                </>
            )}
            <FlashMessage position="top" duration={5000} />
        </>
    );
};

export default Edit;
