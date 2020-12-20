import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCountry } from 'react-native-localize';
import { useTheme } from 'styled-components';
import { Button as ButtonPaper, Dialog } from 'react-native-paper';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import { translate } from '../../Locales';

import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
    createProduct,
} from '../../Functions/Product';
import { createLote } from '../../Functions/Lotes';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';
import BarCodeReader from '../../Components/BarCodeReader';
import Notification from '../../Components/Notification';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputContainer,
    InputText,
    NumericInputField,
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

const adUnitID = __DEV__
    ? TestIds.INTERSTITIAL
    : EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;

const interstitialAd = InterstitialAd.createForAdRequest(adUnitID);

const AddProduct: React.FC = () => {
    const { goBack, navigate, reset } = useNavigation();

    const [locale] = useState(() => {
        if (getCountry() === 'US') {
            return 'en-US';
        }
        return 'pt-BR';
    });
    const [currency] = useState(() => {
        if (getCountry() === 'US') {
            return 'USD';
        }

        return 'BRL';
    });

    const { userPreferences } = useContext(PreferencesContext);

    const theme = useTheme();

    const [adReady, setAdReady] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(0);
    const [store, setStore] = useState<string>();

    const [expDate, setExpDate] = useState(new Date());

    const [cameraEnabled, setCameraEnebled] = useState(false);
    const [productAlreadyExists, setProductAlreadyExists] = useState(false);
    const [erro, setError] = useState<string>('');

    async function handleSave() {
        if (!name || name.trim() === '') {
            setError(translate('View_AddProduct_AlertTypeProductName'));
            return;
        }

        if (code) {
            if (!!store && store !== '') {
                const productExists = await checkIfProductAlreadyExistsByCode({
                    productCode: code,
                    productStore: store,
                });

                if (productExists) {
                    setProductAlreadyExists(true);
                    return;
                }
            } else {
                const productExist = await checkIfProductAlreadyExistsByCode({
                    productCode: code,
                });

                if (productExist) {
                    setProductAlreadyExists(true);
                    return;
                }
            }
        }
        try {
            const newProduct: Omit<IProduct, 'id'> = {
                name,
                code,
                store,
                lotes: [],
            };

            const newLote: Omit<ILote, 'id'> = {
                lote,
                exp_date: expDate,
                amount: Number(amount),
                price,
                status: 'Não tratado',
            };

            const productCreatedId = await createProduct({
                product: newProduct,
            });

            if (productCreatedId) {
                await createLote({
                    lote: newLote,
                    productId: productCreatedId,
                });

                if (!userPreferences.isUserPremium && adReady) {
                    interstitialAd.show();
                }

                reset({
                    index: 1,
                    routes: [
                        { name: 'Home' },
                        { name: 'Success', params: { type: 'create_product' } },
                    ],
                });
            }
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        const eventListener = interstitialAd.onAdEvent((type) => {
            if (type === AdEventType.LOADED) {
                setAdReady(true);
            }
            if (type === AdEventType.CLOSED) {
                setAdReady(false);
            }
            if (type === AdEventType.ERROR) {
                setAdReady(false);
            }
        });

        // Start loading the interstitial straight away
        interstitialAd.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, []);

    const handleAmountChange = useCallback((value) => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleOnCodeRead = useCallback((codeRead: string) => {
        setCode(codeRead);
        setCameraEnebled(false);
    }, []);

    const handleNavigateToExistProduct = useCallback(async () => {
        const prod = await getProductByCode(code);

        if (prod) {
            navigate('ProductDetails', { id: prod.id });
        }
    }, [code, navigate]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return (
        <>
            {cameraEnabled ? (
                <BarCodeReader
                    onCodeRead={handleOnCodeRead}
                    onClose={() => setCameraEnebled(false)}
                />
            ) : (
                <Container>
                    <ScrollView>
                        <PageHeader>
                            <BackButton handleOnPress={goBack} />
                            <PageTitle>
                                {translate('View_AddProduct_PageTitle')}
                            </PageTitle>
                        </PageHeader>

                        <PageContent>
                            <InputContainer>
                                <InputText
                                    placeholder={translate(
                                        'View_AddProduct_InputPlacehoder_Name'
                                    )}
                                    accessibilityLabel={translate(
                                        'View_AddProduct_InputAccessibility_Name'
                                    )}
                                    value={name}
                                    onChangeText={(value) => {
                                        setName(value);
                                    }}
                                    onFocus={() => {
                                        setCameraEnebled(false);
                                    }}
                                />

                                <InputCodeTextContainer>
                                    <InputCodeText
                                        placeholder={translate(
                                            'View_AddProduct_InputPlacehoder_Code'
                                        )}
                                        accessibilityLabel={translate(
                                            'View_AddProduct_InputAccessibility_Code'
                                        )}
                                        value={code}
                                        onChangeText={(value) => setCode(value)}
                                    />
                                    <InputTextIconContainer
                                        onPress={() => setCameraEnebled(true)}
                                    >
                                        <InputCodeTextIcon />
                                    </InputTextIconContainer>
                                </InputCodeTextContainer>

                                <InputGroup>
                                    <InputText
                                        style={{
                                            flex: 5,
                                            marginRight: 5,
                                        }}
                                        placeholder={translate(
                                            'View_AddProduct_InputPlacehoder_Batch'
                                        )}
                                        accessibilityLabel={translate(
                                            'View_AddProduct_InputAccessibility_Batch'
                                        )}
                                        value={lote}
                                        onChangeText={(value) => setLote(value)}
                                        onFocus={() => {
                                            setCameraEnebled(false);
                                        }}
                                    />
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
                                        onChangeText={handleAmountChange}
                                        onFocus={() => {
                                            setCameraEnebled(false);
                                        }}
                                    />
                                </InputGroup>

                                <NumericInputField
                                    type="currency"
                                    locale={locale}
                                    currency={currency}
                                    value={price}
                                    onUpdate={(value: number) =>
                                        setPrice(value)
                                    }
                                    placeholder={translate(
                                        'View_AddProduct_InputPlacehoder_UnitPrice'
                                    )}
                                />

                                {userPreferences.multiplesStores && (
                                    <MoreInformationsContainer>
                                        <MoreInformationsTitle>
                                            {translate(
                                                'View_AddProduct_MoreInformation_Label'
                                            )}
                                        </MoreInformationsTitle>

                                        <InputGroup>
                                            <InputText
                                                style={{
                                                    flex: 1,
                                                }}
                                                placeholder={translate(
                                                    'View_AddProduct_InputPlacehoder_Store'
                                                )}
                                                accessibilityLabel={translate(
                                                    'View_AddProduct_InputAccessibility_Store'
                                                )}
                                                onFocus={() => {
                                                    setCameraEnebled(false);
                                                }}
                                                value={store}
                                                onChangeText={(value) =>
                                                    setStore(value)
                                                }
                                            />
                                        </InputGroup>
                                    </MoreInformationsContainer>
                                )}

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
                                        onDateChange={(value) => {
                                            setExpDate(value);
                                        }}
                                        fadeToColor="none"
                                        mode="date"
                                        locale={locale}
                                    />
                                </ExpDateGroup>
                            </InputContainer>

                            <GenericButton
                                text={translate('View_AddProduct_Button_Save')}
                                accessibilityLabel={translate(
                                    'View_AddProduct_Button_Save_AccessibilityDescription'
                                )}
                                onPress={handleSave}
                            />
                        </PageContent>
                    </ScrollView>
                    {!!erro && (
                        <Notification
                            NotificationType="error"
                            NotificationMessage={erro}
                            onPress={handleDimissNotification}
                        />
                    )}
                </Container>
            )}

            <Dialog
                visible={productAlreadyExists}
                onDismiss={() => {
                    setProductAlreadyExists(false);
                }}
                style={{ backgroundColor: theme.colors.background }}
            >
                <Dialog.Title>
                    {translate(
                        'View_AddProduct_DuplicateProductNotificationTitle'
                    )}
                </Dialog.Title>
                <Dialog.Content>
                    <Text style={{ color: theme.colors.text }}>
                        {translate(
                            'View_AddProduct_DuplicateProductNotificationDescription'
                        )}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <ButtonPaper
                        color={theme.colors.accent}
                        onPress={handleNavigateToExistProduct}
                    >
                        {translate(
                            'View_AddProduct_DuplicateProductNotificationButtonEditProdct'
                        )}
                    </ButtonPaper>
                    <ButtonPaper
                        color={theme.colors.accent}
                        onPress={() => {
                            setProductAlreadyExists(false);
                        }}
                    >
                        {translate(
                            'View_AddProduct_DuplicateProductNotificationButtonClose'
                        )}
                    </ButtonPaper>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};

export default AddProduct;
