import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { createProduct } from '~/Functions/Products/Product';
import { createBatch } from '~/Functions/Products/Batches/Batch';

import { getAllCategoriesFromTeam } from '~/Functions/Categories';
import { getAllBrands } from '~/Functions/Brand';
import { getAllStoresFromTeam } from '~/Functions/Team/Stores/AllStores';
import { findProductByCode } from '~/Functions/Products/FindByCode';

import StatusBar from '~/Components/StatusBar';
import Header from '~/Components/Header';
import GenericButton from '~/Components/Button';
import BarCodeReader from '~/Components/BarCodeReader';
import Loading from '~/Components/Loading';

import DaysToBeNext from '~/Components/Product/Inputs/DaysToBeNext';
import BrandSelect from '~/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '~/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '~/Components/Product/Inputs/Pickers/Store';

import {
    Container,
    PageContent,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
    Currency,
    InputGroup,
    MoreInformationsContainer,
    MoreInformationsTitle,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    InputCodeTextContainer,
    Icon,
    InputTextLoading,
    InputCodeText,
    InputTextIconContainer,
} from './styles';

interface Request {
    route: {
        params: {
            category?: string;
            brand?: string;
            store?: string;
        };
    };
}

const Add: React.FC<Request> = ({ route }: Request) => {
    const { replace } = useNavigation<StackNavigationProp<RoutesParams>>();
    const teamContext = useTeam();

    const [isMounted, setIsMounted] = useState(true);

    const locale = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'en-US';
        }
        return 'pt-BR';
    }, []);
    const currency = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'USD';
        }

        return 'BRL';
    }, []);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [batch, setBatch] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState<number | null>(null);
    const [expDate, setExpDate] = useState(new Date());

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        () => {
            if (route.params && route.params.category) {
                return route.params.category;
            }
            return null;
        }
    );

    const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
        if (route.params && route.params.brand) {
            return route.params.brand;
        }
        return null;
    });

    const [selectedStore, setSelectedStore] = useState<string | null>(() => {
        if (route.params && route.params.store) {
            return route.params.store;
        }
        return null;
    });

    const [categories, setCategories] = useState<Array<IPickerItem>>([]);
    const [brands, setBrands] = useState<Array<IPickerItem>>([]);
    const [stores, setStores] = useState<Array<IPickerItem>>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isFindingProd, setIsFindingProd] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const [productFinded, setProductFinded] = useState<boolean>(false);
    const [productNameFinded, setProductNameFinded] = useState<null | string>(
        null
    );
    const [showProdFindedModal, setShowProdFindedModal] = useState<boolean>(
        false
    );

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);
    const [codeFieldError, setCodeFieldError] = useState<boolean>(false);

    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    const loadData = useCallback(async () => {
        if (!isMounted) return;
        if (!teamContext.id) {
            showMessage({
                message: 'Team is not selected',
                type: 'danger',
            });
            return;
        }
        try {
            setIsLoading(true);
            const response = await getAllCategoriesFromTeam({
                team_id: teamContext.id,
            });

            const categoriesArray: Array<ICategoryItem> = [];
            response.forEach(cat =>
                categoriesArray.push({
                    key: cat.id,
                    label: cat.name,
                    value: cat.id,
                })
            );
            setCategories(categoriesArray);

            const allBrands = await getAllBrands({ team_id: teamContext.id });
            const brandsArray: Array<IBrandItem> = [];

            allBrands.forEach(brand =>
                brandsArray.push({
                    key: brand.id,
                    label: brand.name,
                    value: brand.id,
                })
            );

            setBrands(brandsArray);

            const allStores = await getAllStoresFromTeam({
                team_id: teamContext.id,
            });
            const storesArray: Array<IPickerItem> = [];

            allStores.forEach(store =>
                storesArray.push({
                    key: store.id,
                    label: store.name,
                    value: store.id,
                })
            );

            setStores(storesArray);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [isMounted, teamContext.id]);

    const handleSwitchFindModal = useCallback(() => {
        setShowProdFindedModal(!showProdFindedModal);
    }, [showProdFindedModal]);

    const completeInfo = useCallback(() => {
        if (productNameFinded) {
            setName(productNameFinded);

            setShowProdFindedModal(false);
        }
    }, [productNameFinded]);

    const findProductByEAN = useCallback(async () => {
        if (code !== '') {
            try {
                setIsFindingProd(true);
                const response = await findProductByCode(code);

                if (response !== null) {
                    setProductFinded(true);

                    setProductNameFinded(response.name);
                } else {
                    setProductFinded(false);

                    setProductNameFinded(null);
                }
            } catch (err) {
                if (err instanceof Error) {
                    showMessage({
                        message: err.message,
                        type: 'danger',
                    });
                }
            } finally {
                setIsFindingProd(false);
            }
        }
    }, [code]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSave = useCallback(async () => {
        if (!teamContext.id) {
            return;
        }
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        if (nameFieldError || codeFieldError) {
            return;
        }
        try {
            setIsAdding(true);
            let prodCategory: string | undefined;

            if (selectedCategory && selectedCategory !== 'null') {
                prodCategory = selectedCategory;
            }

            const createdProduct = await createProduct({
                team_id: teamContext.id,
                product: {
                    name,
                    code,
                    brand: selectedBrand || undefined,
                    store: selectedStore || undefined,
                    batches: [],
                },
                category: prodCategory,
            });

            await createBatch({
                productId: createdProduct.id,
                batch: {
                    name: batch || '01',
                    exp_date: String(expDate),
                    amount: Number(amount),
                    price: Number(price),
                    status: 'unchecked',
                },
            });

            showMessage({
                message: strings.View_Success_ProductCreated,
                type: 'info',
            });

            replace('ProductDetails', {
                id: createdProduct.id,
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsAdding(false);
        }
    }, [
        teamContext.id,
        name,
        nameFieldError,
        codeFieldError,
        selectedCategory,
        code,
        selectedBrand,
        selectedStore,
        batch,
        expDate,
        amount,
        price,
        replace,
    ]);

    const handleAmountChange = useCallback(value => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleEnableBarCodeReader = useCallback(() => {
        setIsBarCodeEnabled(true);
    }, []);

    const handleDisableBarCodeReader = useCallback(() => {
        setIsBarCodeEnabled(false);
    }, []);

    const handleOnCodeRead = useCallback(async (codeRead: string) => {
        setCode(codeRead);
        setIsBarCodeEnabled(false);
    }, []);

    const handlePriceChange = useCallback((value: number) => {
        if (value <= 0) {
            setPrice(null);
            return;
        }
        setPrice(value);
    }, []);

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
                    <Header
                        title={strings.View_AddProduct_PageTitle}
                        noDrawer
                    />
                    <StatusBar />
                    <PageContent>
                        <InputContainer>
                            <InputGroup>
                                <InputTextContainer hasError={nameFieldError}>
                                    <InputText
                                        placeholder={
                                            strings.View_AddProduct_InputPlacehoder_Name
                                        }
                                        accessibilityLabel={
                                            strings.View_AddProduct_InputAccessibility_Name
                                        }
                                        value={name}
                                        onChangeText={value => {
                                            setName(value);
                                            setNameFieldError(false);
                                        }}
                                        onFocus={() => {
                                            setIsBarCodeEnabled(false);
                                        }}
                                    />
                                </InputTextContainer>
                            </InputGroup>
                            {nameFieldError && (
                                <InputTextTip>
                                    {
                                        strings.View_AddProduct_AlertTypeProductName
                                    }
                                </InputTextTip>
                            )}

                            <InputCodeTextContainer hasError={codeFieldError}>
                                <InputCodeText
                                    placeholder={
                                        strings.View_AddProduct_InputPlacehoder_Code
                                    }
                                    accessibilityLabel={
                                        strings.View_AddProduct_InputAccessibility_Code
                                    }
                                    value={code}
                                    onBlur={findProductByEAN}
                                    onChangeText={value => {
                                        setCode(value);
                                        setCodeFieldError(false);
                                    }}
                                />
                                <InputTextIconContainer
                                    onPress={handleEnableBarCodeReader}
                                >
                                    <Icon name="barcode-outline" size={34} />
                                </InputTextIconContainer>

                                {teamContext.shareProducts && (
                                    <>
                                        {isFindingProd && <InputTextLoading />}

                                        {productFinded && !isFindingProd && (
                                            <InputTextIconContainer
                                                style={{ marginTop: -5 }}
                                                onPress={handleSwitchFindModal}
                                            >
                                                <Icon
                                                    name="download"
                                                    size={30}
                                                />
                                            </InputTextIconContainer>
                                        )}
                                    </>
                                )}
                            </InputCodeTextContainer>

                            <MoreInformationsContainer>
                                <MoreInformationsTitle>
                                    {
                                        strings.View_AddProduct_MoreInformation_Label
                                    }
                                </MoreInformationsTitle>

                                <InputGroup>
                                    <InputTextContainer
                                        style={{
                                            flex: 5,
                                            marginRight: 10,
                                        }}
                                    >
                                        <InputText
                                            placeholder={
                                                strings.View_AddProduct_InputPlacehoder_Batch
                                            }
                                            accessibilityLabel={
                                                strings.View_AddProduct_InputAccessibility_Batch
                                            }
                                            value={batch}
                                            onChangeText={value =>
                                                setBatch(value)
                                            }
                                            onFocus={() => {
                                                setIsBarCodeEnabled(false);
                                            }}
                                        />
                                    </InputTextContainer>
                                    <InputTextContainer>
                                        <InputText
                                            style={{
                                                flex: 4,
                                            }}
                                            placeholder={
                                                strings.View_AddProduct_InputPlacehoder_Amount
                                            }
                                            accessibilityLabel={
                                                strings.View_AddProduct_InputAccessibility_Amount
                                            }
                                            keyboardType="numeric"
                                            value={String(amount)}
                                            onChangeText={handleAmountChange}
                                            onFocus={() => {
                                                setIsBarCodeEnabled(false);
                                            }}
                                        />
                                    </InputTextContainer>
                                </InputGroup>

                                <Currency
                                    value={price}
                                    onChangeValue={handlePriceChange}
                                    delimiter={currency === 'BRL' ? ',' : '.'}
                                    placeholder={
                                        strings.View_AddProduct_InputPlacehoder_UnitPrice
                                    }
                                />

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

                            <ExpDateGroup>
                                <ExpDateLabel>
                                    {strings.View_AddProduct_CalendarTitle}
                                </ExpDateLabel>

                                <CustomDatePicker
                                    accessibilityLabel={
                                        strings.View_AddProduct_CalendarAccessibilityDescription
                                    }
                                    date={expDate}
                                    onDateChange={value => {
                                        setExpDate(value);
                                    }}
                                    locale={locale}
                                />
                            </ExpDateGroup>
                        </InputContainer>

                        <GenericButton
                            text={strings.View_AddProduct_Button_Save}
                            isLoading={isAdding}
                            onPress={handleSave}
                            contentStyle={{ marginBottom: 30 }}
                        />
                    </PageContent>

                    <Dialog.Container
                        visible={showProdFindedModal}
                        onBackdropPress={handleSwitchFindModal}
                    >
                        <Dialog.Title>Completar infomações?</Dialog.Title>
                        <Dialog.Description>
                            Este produto pode ser algumas informações
                            completadas automáticamente, gostaria de completar
                            as informações?
                        </Dialog.Description>
                        <Dialog.Button
                            label="Não"
                            onPress={handleSwitchFindModal}
                        />
                        <Dialog.Button label="Sim" onPress={completeInfo} />
                    </Dialog.Container>
                </Container>
            )}
        </>
    );
};

export default Add;
