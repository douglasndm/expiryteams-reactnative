import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import { exists, unlink } from 'react-native-fs';

import { translate } from '~/Locales';

import { createProduct } from '~/Functions/Products/Product';
import { createBatch } from '~/Functions/Products/Batches/Batch';
import { getAllCategoriesFromTeam } from '~/Functions/Categories';
import { getImageFileNameFromPath } from '~/Functions/Products/Image';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';
import BarCodeReader from '~/Components/BarCodeReader';

import PreferencesContext from '~/Contexts/PreferencesContext';

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
interface IStoreItem {
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
    const { goBack, navigate, reset } = useNavigation();

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

    const { userPreferences } = useContext(PreferencesContext);

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

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);
    const [codeFieldError, setCodeFieldError] = useState<boolean>(false);

    const [existentProduct, setExistentProduct] = useState<number | null>(null);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    const loadData = useCallback(async () => {
        const response = await getAllCategoriesFromTeam({
            team_id: userPreferences.selectedTeam.team.id,
        });

        if ('error' in response) {
            showMessage({
                message: response.error,
                type: 'default',
            });
            return;
        }

        const categoriesArray: Array<ICategoryItem> = [];
        response.forEach(cat =>
            categoriesArray.push({
                key: cat.id,
                label: cat.name,
                value: cat.id,
            })
        );
        setCategories(categoriesArray);
    }, [userPreferences.selectedTeam.team.id]);

    const handleSave = useCallback(async () => {
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        if (nameFieldError || codeFieldError) {
            return;
        }
        try {
            const picFileName = getImageFileNameFromPath(photoPath);

            const prodCategories: Array<string> = [];

            if (selectedCategory && selectedCategory !== 'null') {
                prodCategories.push(selectedCategory);
            }

            const createdProduct = await createProduct({
                team_id: userPreferences.selectedTeam.team.id,
                product: {
                    name,
                    code,
                    categories: [{ id: selectedCategory || '', name: '' }],
                    batches: [],
                },
            });

            if ('error' in createdProduct) {
                showMessage({
                    message: createdProduct.error,
                    type: 'danger',
                });
                return;
            }

            const createdBatch = await createBatch({
                productId: createdProduct.id,
                batch: {
                    name: batch || '01',
                    exp_date: String(expDate),
                    amount: Number(amount),
                    price: Number(price),
                    status: 'unchecked',
                },
            });

            if ('error' in createdBatch) {
                showMessage({
                    message: createdBatch.error,
                    type: 'danger',
                });
                return;
            }

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    {
                        name: 'Success',
                        params: {
                            type: 'create_product',
                            productId: createdProduct.id,

                            category_id: selectedCategory,
                        },
                    },
                ],
            });
        } catch (error) {
            showMessage({
                message: error.message,
                type: 'danger',
            });
        }
    }, [
        amount,
        code,
        codeFieldError,
        expDate,
        batch,
        name,
        nameFieldError,
        photoPath,
        price,
        reset,
        selectedCategory,
        userPreferences.selectedTeam.team.id,
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

    const handleCheckProductCode = useCallback(
        async (anotherCode?: string) => {
            let theCode;

            if (code) {
                theCode = code;
            } else if (anotherCode) {
                theCode = anotherCode;
            }

            if (theCode) {
                const prodExist = await checkIfProductAlreadyExistsByCode({
                    productCode: theCode,
                    productStore: undefined,
                });

                if (prodExist) {
                    setCodeFieldError(true);

                    const existProd = await getProductByCode(
                        theCode,
                        undefined
                    );
                    setExistentProduct(existProd.id);
                }
            }
        },
        [code]
    );

    const handleNavigateToExistProduct = useCallback(async () => {
        if (existentProduct) {
            navigate('AddLote', { productId: existentProduct });
        }
    }, [existentProduct, navigate]);

    const handleOnCodeRead = useCallback(
        async (codeRead: string) => {
            setCode(codeRead);
            setIsBarCodeEnabled(false);
            await handleCheckProductCode(codeRead);
        },
        [handleCheckProductCode]
    );

    const handlePriceChange = useCallback((value: number) => {
        if (value <= 0) {
            setPrice(null);
            return;
        }
        setPrice(value);
    }, []);

    return (
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
                                        {translate('View_AddProduct_PageTitle')}
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
                                            <InputTextContainer
                                                hasError={nameFieldError}
                                            >
                                                <InputText
                                                    placeholder={translate(
                                                        'View_AddProduct_InputPlacehoder_Name'
                                                    )}
                                                    accessibilityLabel={translate(
                                                        'View_AddProduct_InputAccessibility_Name'
                                                    )}
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
                                                {translate(
                                                    'View_AddProduct_AlertTypeProductName'
                                                )}
                                            </InputTextTip>
                                        )}

                                        <InputCodeTextContainer
                                            hasError={codeFieldError}
                                        >
                                            <InputCodeText
                                                placeholder={translate(
                                                    'View_AddProduct_InputPlacehoder_Code'
                                                )}
                                                accessibilityLabel={translate(
                                                    'View_AddProduct_InputAccessibility_Code'
                                                )}
                                                value={code}
                                                onChangeText={value => {
                                                    setCode(value);
                                                    setCodeFieldError(false);
                                                }}
                                                onBlur={handleCheckProductCode}
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
                                                {translate(
                                                    'View_AddProduct_Tip_DuplicateProduct'
                                                )}
                                            </InputTextTip>
                                        )}

                                        <MoreInformationsContainer>
                                            <MoreInformationsTitle>
                                                {translate(
                                                    'View_AddProduct_MoreInformation_Label'
                                                )}
                                            </MoreInformationsTitle>

                                            <InputGroup>
                                                <InputTextContainer
                                                    style={{
                                                        flex: 5,
                                                        marginRight: 10,
                                                    }}
                                                >
                                                    <InputText
                                                        placeholder={translate(
                                                            'View_AddProduct_InputPlacehoder_Batch'
                                                        )}
                                                        accessibilityLabel={translate(
                                                            'View_AddProduct_InputAccessibility_Batch'
                                                        )}
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
                                                        placeholder={translate(
                                                            'View_AddProduct_InputPlacehoder_Amount'
                                                        )}
                                                        accessibilityLabel={translate(
                                                            'View_AddProduct_InputAccessibility_Amount'
                                                        )}
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
                                                placeholder={translate(
                                                    'View_AddProduct_InputPlacehoder_UnitPrice'
                                                )}
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
                                                        label: translate(
                                                            'View_AddProduct_InputPlaceholder_SelectCategory'
                                                        ),
                                                        value: 'null',
                                                    }}
                                                />
                                            </PickerContainer>
                                        </MoreInformationsContainer>

                                        <ExpDateGroup>
                                            <ExpDateLabel>
                                                {translate(
                                                    'View_AddProduct_CalendarTitle'
                                                )}
                                            </ExpDateLabel>

                                            <CustomDatePicker
                                                accessibilityLabel={translate(
                                                    'View_AddProduct_CalendarAccessibilityDescription'
                                                )}
                                                date={expDate}
                                                onDateChange={value => {
                                                    setExpDate(value);
                                                }}
                                                locale={locale}
                                            />
                                        </ExpDateGroup>
                                    </InputContainer>

                                    <GenericButton
                                        text={translate(
                                            'View_AddProduct_Button_Save'
                                        )}
                                        accessibilityLabel={translate(
                                            'View_AddProduct_Button_Save_AccessibilityDescription'
                                        )}
                                        onPress={handleSave}
                                    />
                                </PageContent>
                            </ScrollView>

                            <FlashMessage duration={5000} position="top" />
                        </Container>
                    )}
                </>
            )}
        </>
    );
};

export default Add;
