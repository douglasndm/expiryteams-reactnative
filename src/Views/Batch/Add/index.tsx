import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Alert, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCountry } from 'react-native-localize';
import crashlytics from '@react-native-firebase/crashlytics';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import { translate } from '../../../Locales';

import StatusBar from '../../../Components/StatusBar';
import BackButton from '../../../Components/BackButton';
import GenericButton from '../../../Components/Button';
import Notification from '../../../Components/Notification';

import { createLote } from '../../../Functions/Lotes';
import { getProductById } from '../../../Functions/Product';

import PreferencesContext from '../../../Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputContainer,
    InputTextContainer,
    InputText,
    NumericInputField,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
} from '../../AddProduct/styles';
import { ProductHeader, ProductName, ProductCode } from './styles';

interface Props {
    route: {
        params: {
            productId: number;
        };
    };
}

let adUnit = TestIds.INTERSTITIAL;

if (Platform.OS === 'ios' && !__DEV__) {
    adUnit = EnvConfig.IOS_ADUNIT_INTERSTITIAL_ADD_BATCH;
} else if (Platform.OS === 'android' && !__DEV__) {
    adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_ADDLOTE;
}

const interstitialAd = InterstitialAd.createForAdRequest(adUnit);

const AddBatch: React.FC<Props> = ({ route }: Props) => {
    const { productId } = route.params;
    const { reset, goBack } = useNavigation();

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

    const [notification, setNotification] = useState<string>();

    const [adReady, setAdReady] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [price, setPrice] = useState(0);

    const [expDate, setExpDate] = useState(new Date());

    const handleSave = useCallback(async () => {
        if (!lote || lote.trim() === '') {
            Alert.alert(translate('View_AddBatch_AlertTypeBatchName'));
            return;
        }
        try {
            await createLote({
                productId,
                lote: {
                    lote,
                    amount: Number(amount),
                    exp_date: expDate,
                    price,
                    status: 'Não tratado',
                },
            });

            if (!userPreferences.isUserPremium && adReady) {
                await interstitialAd.show();
            }

            reset({
                routes: [
                    { name: 'Home' },
                    { name: 'ProductDetails', params: { id: productId } },
                    { name: 'Success', params: { type: 'create_batch' } },
                ],
            });
        } catch (err) {
            crashlytics().recordError(err);
            setNotification(err);
        }
    }, [
        amount,
        productId,
        expDate,
        lote,
        reset,
        price,
        adReady,
        userPreferences.isUserPremium,
    ]);

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

    useEffect(() => {
        async function getProduct() {
            const prod = await getProductById(productId);

            if (prod) {
                setName(prod.name);

                if (prod.code) setCode(prod.code);
            }
        }
        getProduct();
    }, [productId]);

    const handleAmountChange = useCallback((value) => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleDimissNotification = useCallback(() => {
        setNotification('');
    }, []);

    return (
        <Container>
            <StatusBar />
            <ScrollView>
                <PageHeader>
                    <BackButton handleOnPress={goBack} />
                    <PageTitle>
                        {translate('View_AddBatch_PageTitle')}
                    </PageTitle>
                </PageHeader>

                <PageContent>
                    <InputContainer>
                        <ProductHeader>
                            <ProductName>{name}</ProductName>
                            <ProductCode>{code}</ProductCode>
                        </ProductHeader>

                        <InputGroup>
                            <InputTextContainer
                                style={{
                                    flex: 5,
                                    marginRight: 5,
                                }}
                            >
                                <InputText
                                    placeholder={translate(
                                        'View_AddBatch_InputPlacehoder_Batch'
                                    )}
                                    value={lote}
                                    onChangeText={(value) => setLote(value)}
                                />
                            </InputTextContainer>
                            <InputTextContainer
                                style={{
                                    flex: 4,
                                }}
                            >
                                <InputText
                                    placeholder={translate(
                                        'View_AddBatch_InputPlacehoder_Amount'
                                    )}
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={handleAmountChange}
                                />
                            </InputTextContainer>
                        </InputGroup>

                        <NumericInputField
                            type="currency"
                            locale={locale}
                            currency={currency}
                            value={price}
                            onUpdate={(value: number) => setPrice(value)}
                            placeholder={translate(
                                'View_AddBatch_InputPlacehoder_UnitPrice'
                            )}
                        />

                        <ExpDateGroup>
                            <ExpDateLabel>
                                {translate('View_AddBatch_CalendarTitle')}
                            </ExpDateLabel>
                            <CustomDatePicker
                                date={expDate}
                                onDateChange={(value) => {
                                    setExpDate(value);
                                }}
                                locale={locale}
                            />
                        </ExpDateGroup>
                    </InputContainer>

                    <GenericButton
                        text={translate('View_AddBatch_Button_Save')}
                        onPress={handleSave}
                    />
                </PageContent>
            </ScrollView>

            {!!notification && (
                <Notification
                    NotificationMessage={notification}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </Container>
    );
};

export default AddBatch;
