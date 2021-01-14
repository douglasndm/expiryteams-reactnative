import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useTheme } from 'styled-components/native';

import { exists, unlink } from 'react-native-fs';
import { translate } from '../../Locales';

import StatusBar from '../../Components/StatusBar';
import Loading from '../../Components/Loading';
import BackButton from '../../Components/BackButton';
import Camera from '../../Components/Camera';
import BarCodeReader from '../../Components/BarCodeReader';
import Notification from '../../Components/Notification';

import {
    getProductById,
    updateProduct,
    deleteProduct,
} from '../../Functions/Product';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputGroup,
    InputContainer,
    InputTextContainer,
    InputText,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
    ProductImage,
    CameraButtonContainer,
    CameraButtonIcon,
    ProductImageContainer,
} from '../AddProduct/styles';

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
            productId: number;
        };
    };
}

const EditProduct: React.FC<RequestParams> = ({ route }: RequestParams) => {
    const { userPreferences } = useContext(PreferencesContext);

    const { productId } = route.params;

    const { reset, goBack } = useNavigation();
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [photoPath, setPhotoPath] = useState('');
    const [store, setStore] = useState<string>('');

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    useEffect(() => {
        async function getProductData() {
            setIsLoading(true);

            const product = await getProductById(productId);

            if (!product) {
                throw new Error(
                    translate('View_EditProduct_Error_ProductNotFound')
                );
            }

            setName(product.name);
            if (product.code) setCode(product.code);
            if (product.store) setStore(product.store);
            if (product.photo) {
                if (await exists(product.photo)) {
                    setPhotoPath(product.photo);
                }
            }

            setIsLoading(false);
        }
        getProductData();
    }, [productId]);

    async function updateProd() {
        if (!name || name.trim() === '') {
            setError(translate('View_EditProduct_Error_EmptyProductName'));
            return;
        }

        try {
            updateProduct({
                id: productId,
                name,
                code,
                store,
                photo: photoPath,
            });

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
    }

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

    const onPhotoTaked = useCallback(
        async (path: string) => {
            if (await exists(path)) {
                setPhotoPath(path);

                const product = await getProductById(productId);

                if (product.photo) {
                    if (await exists(product.photo)) {
                        await unlink(product.photo);
                    }
                }

                await updateProduct({
                    ...product,
                    id: productId,
                    photo: path,
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
                                    {!!photoPath &&
                                        userPreferences.isUserPremium && (
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
                                                    onChangeText={(value) => {
                                                        setName(value);
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

                                        <InputCodeTextContainer>
                                            <InputCodeText
                                                placeholder={translate(
                                                    'View_EditProduct_InputPlacehoder_Code'
                                                )}
                                                accessibilityLabel={translate(
                                                    'View_EditProduct_InputAccessibility_Code'
                                                )}
                                                value={code}
                                                onChangeText={(value) =>
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

                                        {userPreferences.multiplesStores && (
                                            <InputGroup>
                                                <InputTextContainer>
                                                    <InputText
                                                        placeholder={translate(
                                                            'View_EditProduct_InputPlacehoder_Store'
                                                        )}
                                                        accessibilityLabel={translate(
                                                            'View_EditProduct_InputAccessibility_Store'
                                                        )}
                                                        value={store}
                                                        onChangeText={(
                                                            value
                                                        ) => {
                                                            setStore(value);
                                                        }}
                                                    />
                                                </InputTextContainer>
                                            </InputGroup>
                                        )}

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
        </>
    );
};

export default EditProduct;
