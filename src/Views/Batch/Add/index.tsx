import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';

import { getProduct } from '~/Functions/Products/Product';
import { createBatch } from '~/Functions/Products/Batches/Batch';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputContainer,
    InputTextContainer,
    InputText,
    Currency,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
} from '~/Views/Product/Add/styles';
import { ProductHeader, ProductName, ProductCode } from './styles';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

interface Props {
    route: {
        params: {
            productId: string;
        };
    };
}

const AddBatch: React.FC<Props> = ({ route }: Props) => {
    const { productId } = route.params;
    const { reset, goBack } = useNavigation();

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
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [price, setPrice] = useState(0);

    const [expDate, setExpDate] = useState(new Date());

    const handleSave = useCallback(async () => {
        if (!lote || lote.trim() === '') {
            showMessage({
                message: translate('View_AddBatch_AlertTypeBatchName'),
                type: 'danger',
            });
            return;
        }
        try {
            const response = await createBatch({
                productId,
                batch: {
                    name: lote,
                    amount: Number(amount),
                    exp_date: String(expDate),
                    price,
                    status: 'unchecked',
                },
            });

            if ('error' in response) {
                showMessage({
                    message: response.error,
                    type: 'danger',
                });

                if (response.status === 401) {
                    await logoutFirebase();

                    reset({
                        routes: [
                            {
                                name: 'Login',
                            },
                        ],
                    });
                }
                return;
            }

            reset({
                routes: [
                    { name: 'Home' },
                    { name: 'ProductDetails', params: { id: productId } },
                    {
                        name: 'Success',
                        params: { type: 'create_batch', productId },
                    },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [amount, productId, expDate, lote, reset, price]);

    const loadData = useCallback(async () => {
        const prod = await getProduct({ productId });

        if ('error' in prod) {
            if (prod.status === 401) {
                await logoutFirebase();

                reset({
                    routes: [
                        {
                            name: 'Login',
                        },
                    ],
                });
            }
            return;
        }

        if (prod) {
            setName(prod.name);

            if (prod.code) setCode(prod.code);
        }
    }, [productId, reset]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAmountChange = useCallback(value => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handlePriceChange = useCallback((value: number) => {
        setPrice(value);
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
                                    onChangeText={value => setLote(value)}
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

                        <Currency
                            value={price}
                            onChangeValue={handlePriceChange}
                            delimiter={currency === 'BRL' ? ',' : '.'}
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
                                onDateChange={value => {
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
        </Container>
    );
};

export default AddBatch;
