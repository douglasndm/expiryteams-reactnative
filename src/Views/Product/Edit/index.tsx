import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { deleteProduct, updateProduct } from '~/Functions/Products/Product';
import { getExtraInfoForProducts } from '~/Functions/Products/ExtraInfo';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import BarCodeReader from '~/Components/BarCodeReader';

import DaysToBeNext from '~/Components/Product/Inputs/DaysToBeNext';
import BrandSelect from '~/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '~/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '~/Components/Product/Inputs/Pickers/Store';

import {
    Container,
    PageContent,
    InputGroup,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
    InputCodeTextContainer,
    InputCodeText,
    InputTextIconContainer,
    MoreInformationsContainer,
    MoreInformationsTitle,
} from '../Add/styles';

import {
    ButtonPaper,
    Icons,
    ActionsButtonContainer,
    PageTitleContainer,
} from './styles';

interface RequestParams {
    route: {
        params: {
            product: string;
        };
    };
}

const Edit: React.FC<RequestParams> = ({ route }: RequestParams) => {
    const { reset, replace } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();

    const [isMounted, setIsMounted] = useState(true);

    const teamContext = useTeam();

    const userRole = useMemo(() => {
        if (teamContext.roleInTeam) {
            return teamContext.roleInTeam.role.toLowerCase();
        }

        return 'repositor';
    }, [teamContext.roleInTeam]);

    const product = useMemo<IProduct>(() => {
        return JSON.parse(route.params.product);
    }, [route.params.product]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState<string | undefined>('');

    const [categories, setCategories] = useState<Array<IPickerItem>>([]);
    const [brands, setBrands] = useState<Array<IPickerItem>>([]);
    const [stores, setStores] = useState<Array<IPickerItem>>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedStore, setSelectedStore] = useState<string | null>(null);

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);

    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    const loadData = useCallback(async () => {
        if (!isMounted) return;
        if (!teamContext.id) {
            return;
        }
        try {
            setIsLoading(true);

            setName(product.name);
            setCode(product.code);

            const response = await getExtraInfoForProducts({
                team_id: teamContext.id,
            });

            const categoriesArray: Array<IPickerItem> = [];

            response.availableCategories.forEach(cat =>
                categoriesArray.push({
                    key: cat.id,
                    label: cat.name,
                    value: cat.id,
                })
            );
            setCategories(categoriesArray);

            const brandsArray: Array<IPickerItem> = [];

            response.availableBrands.forEach(brand =>
                brandsArray.push({
                    key: brand.id,
                    label: brand.name,
                    value: brand.id,
                })
            );

            setBrands(brandsArray);

            const storesArray: Array<IPickerItem> = [];

            response.availableStores.forEach(store =>
                storesArray.push({
                    key: store.id,
                    label: store.name,
                    value: store.id,
                })
            );

            setStores(storesArray);

            if (product.categories.length > 0) {
                setSelectedCategory(product.categories[0].id);
            }
            if (product.brand) {
                setSelectedBrand(product.brand);
            }
            if (product.store) {
                setSelectedStore(product.store);
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [isMounted, product, teamContext.id]);

    const updateProd = useCallback(async () => {
        if (!isMounted) return;
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        try {
            const prodCategories: Array<string> = [];

            if (selectedCategory && selectedCategory !== 'null') {
                prodCategories.push(selectedCategory);
            }

            await updateProduct({
                product: {
                    id: product.id,
                    name,
                    code,
                    brand: selectedBrand,
                    store: selectedStore,
                },
                categories: prodCategories,
            });

            showMessage({
                message: strings.View_Success_ProductUpdated,
                type: 'info',
            });

            replace('ProductDetails', {
                id: product.id,
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, [
        code,
        isMounted,
        name,
        product.id,
        replace,
        selectedBrand,
        selectedCategory,
        selectedStore,
    ]);

    const handleDeleteProduct = useCallback(async () => {
        if (!isMounted) return;
        try {
            await deleteProduct({ product_id: product.id });

            showMessage({
                message: strings.View_Success_ProductDeleted,
                type: 'info',
            });

            reset({
                routes: [{ name: 'Home' }],
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setDeleteComponentVisible(false);
        }
    }, [isMounted, product.id, reset]);

    const handleOnCodeRead = useCallback((codeRead: string) => {
        setCode(codeRead);
        setIsBarCodeEnabled(false);
    }, []);

    const handleEnableBarCodeReader = useCallback(() => {
        setIsBarCodeEnabled(true);
    }, []);

    const handleDisableBarCodeReader = useCallback(() => {
        setIsBarCodeEnabled(false);
    }, []);

    const handleSwitchShowDeleteProduct = useCallback(() => {
        setDeleteComponentVisible(!deleteComponentVisible);
    }, [deleteComponentVisible]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        return () => {
            setIsMounted(false);
        };
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {isBarCodeEnabled ? (
                <BarCodeReader
                    onCodeRead={handleOnCodeRead}
                    onClose={handleDisableBarCodeReader}
                />
            ) : (
                <Container>
                    <StatusBar />
                    <PageTitleContainer>
                        <Header
                            title={strings.View_EditProduct_PageTitle}
                            noDrawer
                        />

                        <ActionsButtonContainer>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="save-outline" size={22} />
                                )}
                                onPress={updateProd}
                            >
                                {strings.View_EditProduct_Button_Save}
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
                    </PageTitleContainer>

                    <PageContent>
                        <InputContainer>
                            <InputGroup>
                                <InputTextContainer>
                                    <InputText
                                        placeholder={
                                            strings.View_EditProduct_InputPlacehoder_Name
                                        }
                                        accessibilityLabel={
                                            strings.View_EditProduct_InputAccessibility_Name
                                        }
                                        value={name}
                                        onChangeText={value => {
                                            setName(value);
                                            setNameFieldError(false);
                                        }}
                                    />
                                </InputTextContainer>
                            </InputGroup>
                            {nameFieldError && (
                                <InputTextTip>
                                    {
                                        strings.View_EditProduct_Error_EmptyProductName
                                    }
                                </InputTextTip>
                            )}

                            <InputCodeTextContainer>
                                <InputCodeText
                                    placeholder={
                                        strings.View_EditProduct_InputPlacehoder_Code
                                    }
                                    accessibilityLabel={
                                        strings.View_EditProduct_InputAccessibility_Code
                                    }
                                    value={code}
                                    onChangeText={value => setCode(value)}
                                />
                                <InputTextIconContainer
                                    onPress={handleEnableBarCodeReader}
                                >
                                    <Icons name="barcode-outline" size={34} />
                                </InputTextIconContainer>
                            </InputCodeTextContainer>

                            <MoreInformationsContainer>
                                <MoreInformationsTitle>
                                    {
                                        strings.View_AddProduct_MoreInformation_Label
                                    }
                                </MoreInformationsTitle>

                                <CategorySelect
                                    categories={categories}
                                    onChange={setSelectedCategory}
                                    defaultValue={selectedCategory}
                                    containerStyle={{
                                        marginBottom: 10,
                                    }}
                                />

                                <BrandSelect
                                    brands={brands}
                                    onChange={setSelectedBrand}
                                    defaultValue={selectedBrand}
                                    containerStyle={{
                                        marginBottom: 10,
                                    }}
                                />

                                {teamContext.roleInTeam?.role.toLowerCase() ===
                                    'manager' && (
                                    <StoreSelect
                                        stores={stores}
                                        defaultValue={selectedStore}
                                        onChange={setSelectedStore}
                                        containerStyle={{
                                            marginBottom: 10,
                                        }}
                                    />
                                )}
                            </MoreInformationsContainer>
                        </InputContainer>
                    </PageContent>

                    <Dialog.Container
                        visible={deleteComponentVisible}
                        onBackdropPress={handleSwitchShowDeleteProduct}
                    >
                        <Dialog.Title>
                            {strings.View_ProductDetails_WarningDelete_Title}
                        </Dialog.Title>
                        <Dialog.Description>
                            {strings.View_ProductDetails_WarningDelete_Message}
                        </Dialog.Description>
                        <Dialog.Button
                            label={
                                strings.View_ProductDetails_WarningDelete_Button_Cancel
                            }
                            onPress={handleSwitchShowDeleteProduct}
                        />
                        <Dialog.Button
                            label={
                                strings.View_ProductDetails_WarningDelete_Button_Confirm
                            }
                            color="red"
                            onPress={handleDeleteProduct}
                        />
                    </Dialog.Container>
                </Container>
            )}
        </>
    );
};

export default Edit;
