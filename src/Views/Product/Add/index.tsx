import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { exists, unlink } from 'react-native-fs';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { createProduct } from '~/Functions/Products/Product';
import { createBatch } from '~/Functions/Products/Batches/Batch';
import { getAllCategoriesFromTeam } from '~/Functions/Categories';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';
import BarCodeReader from '~/Components/BarCodeReader';
import Loading from '~/Components/Loading';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    ProductImageContainer,
    ProductImage,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
    CameraButtonContainer,
    CameraButtonIcon,
    Currency,
    InputGroup,
    MoreInformationsContainer,
    MoreInformationsTitle,
    PickerContainer,
    Picker,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
} from './styles';

interface ICategoryItem {
    label: string;
    value: string;
    key: string;
}

interface Request {
    route: {
        params: {
            store?: string;
            category?: string;
        };
    };
}

const Add: React.FC<Request> = ({ route }: Request) => {
    const { goBack, navigate, replace } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();
    const teamContext = useTeam();

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
    const [photoPath, setPhotoPath] = useState('');
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

    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);
    const [codeFieldError, setCodeFieldError] = useState<boolean>(false);

    const [existentProduct, setExistentProduct] = useState<number | null>(null);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    const loadData = useCallback(async () => {
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
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [teamContext.id]);

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
        } catch (error) {
            showMessage({
                message: error.message,
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
        batch,
        expDate,
        amount,
        price,
        replace,
    ]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCategoryChange = useCallback(value => {
        setSelectedCategory(value);
    }, []);

    const handleAmountChange = useCallback(value => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleEnableCamera = useCallback(async () => {
        if (photoPath) {
            if (await exists(photoPath)) {
                await unlink(photoPath);
            }
        }
        setIsBarCodeEnabled(false);
        setIsCameraEnabled(true);
    }, [photoPath]);

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
        async ({ fileName, filePath }: onPhotoTakedProps) => {
            if (await exists(filePath)) {
                setPhotoPath(filePath);
            }

            handleDisableCamera();
        },
        [handleDisableCamera]
    );

    const handleNavigateToExistProduct = useCallback(async () => {
        if (existentProduct) {
            navigate('AddBatch', { productId: existentProduct });
        }
    }, [existentProduct, navigate]);

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

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {isCameraEnabled ? (
                <Camera onPhotoTaked={onPhotoTaked} />
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
                                    {/* {!!photoPath && (
                                        <ProductImageContainer
                                            onPress={handleEnableCamera}
                                        >
                                            <ProductImage
                                                source={{
                                                    uri: `file://${photoPath}`,
                                                }}
                                            />
                                        </ProductImageContainer>
                                    )} */}

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
                                                        setNameFieldError(
                                                            false
                                                        );
                                                    }}
                                                    onFocus={() => {
                                                        setIsBarCodeEnabled(
                                                            false
                                                        );
                                                    }}
                                                />
                                            </InputTextContainer>

                                            {/* <CameraButtonContainer
                                                onPress={handleEnableCamera}
                                            >
                                                <CameraButtonIcon />
                                            </CameraButtonContainer> */}
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
                                                onPress={
                                                    handleEnableBarCodeReader
                                                }
                                            >
                                                <InputCodeTextIcon />
                                            </InputTextIconContainer>
                                        </InputCodeTextContainer>

                                        {codeFieldError && (
                                            <InputTextTip
                                                onPress={
                                                    handleNavigateToExistProduct
                                                }
                                            >
                                                {
                                                    strings.View_AddProduct_Tip_DuplicateProduct
                                                }
                                            </InputTextTip>
                                        )}

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
                                                            setIsBarCodeEnabled(
                                                                false
                                                            );
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
                                                            setIsBarCodeEnabled(
                                                                false
                                                            );
                                                        }}
                                                    />
                                                </InputTextContainer>
                                            </InputGroup>

                                            <Currency
                                                value={price}
                                                onChangeValue={
                                                    handlePriceChange
                                                }
                                                delimiter={
                                                    currency === 'BRL'
                                                        ? ','
                                                        : '.'
                                                }
                                                placeholder={
                                                    strings.View_AddProduct_InputPlacehoder_UnitPrice
                                                }
                                            />

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
                                                        label:
                                                            strings.View_AddProduct_InputPlaceholder_SelectCategory,
                                                        value: 'null',
                                                    }}
                                                />
                                            </PickerContainer>
                                        </MoreInformationsContainer>

                                        <ExpDateGroup>
                                            <ExpDateLabel>
                                                {
                                                    strings.View_AddProduct_CalendarTitle
                                                }
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
                                        text={
                                            strings.View_AddProduct_Button_Save
                                        }
                                        isLoading={isAdding}
                                        onPress={handleSave}
                                    />
                                </PageContent>
                            </ScrollView>
                        </Container>
                    )}
                </>
            )}
        </>
    );
};

export default Add;
