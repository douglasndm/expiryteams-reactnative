import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import StatusBar from '~/Components/StatusBar';
import Header from '~/Components/Header';
import GenericButton from '~/Components/Button';

import { getProduct } from '~/Functions/Products/Product';
import { createBatch } from '~/Functions/Products/Batches/Batch';

import {
    Container,
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

interface Props {
    route: {
        params: {
            productId: string;
        };
    };
}

const AddBatch: React.FC<Props> = ({ route }: Props) => {
    const teamContext = useTeam();

    const { productId } = route.params;

    const { replace } = useNavigation<StackNavigationProp<RoutesParams>>();

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

    const [isMounted, setIsMounted] = useState(true);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [price, setPrice] = useState<number | null>(null);

    const [expDate, setExpDate] = useState(new Date());

    const handleSave = useCallback(async () => {
        if (!isMounted) return;
        if (!lote || lote.trim() === '') {
            showMessage({
                message: strings.View_AddBatch_AlertTypeBatchName,
                type: 'danger',
            });
            return;
        }
        try {
            setIsAdding(true);
            await createBatch({
                productId,
                batch: {
                    name: lote,
                    amount: Number(amount),
                    exp_date: String(expDate),
                    price: price || undefined,
                    status: 'unchecked',
                },
            });

            showMessage({
                message: strings.View_Success_BatchCreated,
                type: 'info',
            });

            replace('ProductDetails', {
                id: productId,
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
    }, [isMounted, lote, productId, amount, expDate, price, replace]);

    const loadData = useCallback(async () => {
        if (!isMounted || !teamContext.id) return;
        const prod = await getProduct({ productId, team_id: teamContext.id });

        if (prod) {
            setName(prod.name);

            if (prod.code) setCode(prod.code);
        }
    }, [isMounted, productId, teamContext.id]);

    useEffect(() => {
        loadData();

        return () => setIsMounted(false);
    }, []);

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
                <Header title={strings.View_AddBatch_PageTitle} noDrawer />

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
                                    placeholder={
                                        strings.View_AddBatch_InputPlacehoder_Batch
                                    }
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
                                    placeholder={
                                        strings.View_AddBatch_InputPlacehoder_Amount
                                    }
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
                            placeholder={
                                strings.View_AddBatch_InputPlacehoder_UnitPrice
                            }
                        />

                        <ExpDateGroup>
                            <ExpDateLabel>
                                {strings.View_AddBatch_CalendarTitle}
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
                        text={strings.View_AddBatch_Button_Save}
                        onPress={handleSave}
                        isLoading={isAdding}
                    />
                </PageContent>
            </ScrollView>
        </Container>
    );
};

export default AddBatch;
