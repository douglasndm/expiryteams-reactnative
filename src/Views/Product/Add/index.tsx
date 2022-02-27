import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { createProduct } from '~/Functions/Products/Product';
import { createBatch } from '~/Functions/Products/Batches/Batch';

import { getAllCategoriesFromTeam } from '~/Functions/Categories';
import { getAllBrands } from '~/Functions/Brand';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';
import BarCodeReader from '~/Components/BarCodeReader';
import Loading from '~/Components/Loading';

import DaysToBeNext from '~/Components/Product/Inputs/DaysToBeNext';
import BrandSelect from '~/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '~/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '~/Components/Product/Inputs/Pickers/Store';

import {
    Container,
    PageHeader,
    PageTitle,
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
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
} from './styles';

interface Request {
    route: {
        params: {
            store?: string;
            category?: string;
            brand?: string;
        };
    };
}

const Add: React.FC<Request> = ({ route }: Request) => {
    const { goBack, replace } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();
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

    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);
    const [brands, setBrands] = useState<Array<IBrandItem>>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isAdding, setIsAdding] = useState<boolean>(false);

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
            const prodCategories: Array<string> = [];

            if (selectedCategory && selectedCategory !== 'null') {
                prodCategories.push(selectedCategory);
            }

            const createdProduct = await createProduct({
                team_id: teamContext.id,
                product: {
                    name,
                    code,
                    brand: selectedBrand || undefined,
                    batches: [],
                },
                categories: prodCategories,
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
                    <StatusBar />
                    <ScrollView>
                        <PageHeader>
                            <BackButton handleOnPress={goBack} />
                            <PageTitle>
                                {strings.View_AddProduct_PageTitle}
                            </PageTitle>
                        </PageHeader>

                        <PageContent>
                            <InputContainer>
                                <InputGroup>
                                    <InputTextContainer
                                        hasError={nameFieldError}
                                    >
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

                                <InputCodeTextContainer
                                    hasError={codeFieldError}
                                >
                                    <InputCodeText
                                        placeholder={
                                            strings.View_AddProduct_InputPlacehoder_Code
                                        }
                                        accessibilityLabel={
                                            strings.View_AddProduct_InputAccessibility_Code
                                        }
                                        value={code}
                                        onChangeText={value => {
                                            setCode(value);
                                            setCodeFieldError(false);
                                        }}
                                    />
                                    <InputTextIconContainer
                                        onPress={handleEnableBarCodeReader}
                                    >
                                        <InputCodeTextIcon />
                                    </InputTextIconContainer>
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
                                                onChangeText={
                                                    handleAmountChange
                                                }
                                                onFocus={() => {
                                                    setIsBarCodeEnabled(false);
                                                }}
                                            />
                                        </InputTextContainer>
                                    </InputGroup>

                                    <Currency
                                        value={price}
                                        onChangeValue={handlePriceChange}
                                        delimiter={
                                            currency === 'BRL' ? ',' : '.'
                                        }
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
                            />
                        </PageContent>
                    </ScrollView>
                </Container>
            )}
        </>
    );
};

export default Add;
