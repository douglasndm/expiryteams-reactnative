import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { Dialog } from 'react-native-paper';
import { useTheme } from 'styled-components';

import { translate } from '~/Locales';

import { updateLote, deleteLote } from '~/Functions/Lotes';
import { getProductById } from '~/Functions/Product';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';
import Notification from '~/Components/Notification';

import {
    Container,
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
} from '~/Views/Product/Add/styles';
import { ProductHeader, ProductName, ProductCode } from '../Add/styles';

import {
    PageHeader,
    PageTitleContainer,
    Button,
    Icons,
    RadioButton,
    RadioButtonText,
} from './styles';

interface Props {
    productId: number;
    loteId: number;
}

const EditBatch: React.FC = () => {
    const route = useRoute();
    const { reset, goBack } = useNavigation();

    const routeParams = route.params as Props;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [locale] = useState(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'en-US';
        }
        return 'pt-BR';
    });
    const [currency] = useState(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'USD';
        }

        return 'BRL';
    });

    const [product, setProduct] = useState<IProduct | null>(null);

    const productId = useMemo(() => {
        return routeParams.productId;
    }, [routeParams]);

    const loteId = useMemo(() => {
        return routeParams.loteId;
    }, [routeParams]);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const theme = useTheme();

    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    const [expDate, setExpDate] = useState(new Date());
    const [tratado, setTratado] = useState(false);

    useEffect(() => {
        async function getData() {
            setIsLoading(true);

            const response = await getProductById(productId);
            setProduct(response);

            if (!response) return;

            const loteResult = response.lotes.find((l) => l.id === loteId);

            if (!loteResult) {
                setError(translate('View_EditBatch_Error_BatchDidntFound'));
                return;
            }

            const loteStatus = loteResult.status === 'Tratado';

            setLote(loteResult.lote);
            setExpDate(loteResult.exp_date);
            setTratado(loteStatus);

            if (loteResult.amount) setAmount(loteResult.amount);
            if (loteResult.price) setPrice(loteResult.price);
            setIsLoading(false);
        }

        getData();
    }, [productId, loteId]);

    async function handleSave() {
        if (!lote || lote.trim() === '') {
            Alert.alert(translate('View_EditBatch_Error_BatchWithNoName'));
            return;
        }

        try {
            await updateLote({
                id: loteId,
                lote,
                amount: Number(amount),
                exp_date: expDate,
                price,
                status: tratado ? 'Tratado' : 'Não tratado',
            });

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    {
                        name: 'Success',
                        params: { productId, type: 'edit_batch' },
                    },
                ],
            });
        } catch (err) {
            setError(err.message);
        }
    }

    const handleDelete = useCallback(async () => {
        try {
            await deleteLote(loteId);

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'Success', params: { type: 'delete_batch' } },
                ],
            });
        } catch (err) {
            setError(err.message);
        }
    }, [loteId, reset]);

    const handleAmountChange = useCallback((value) => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <StatusBar />
                <ScrollView>
                    <PageHeader>
                        <PageTitleContainer>
                            <BackButton handleOnPress={goBack} />
                            <PageTitle>
                                {translate('View_EditBatch_PageTitle')}
                            </PageTitle>
                        </PageTitleContainer>

                        <Button
                            icon={() => (
                                <Icons name="trash-outline" size={22} />
                            )}
                            onPress={() => {
                                setDeleteComponentVisible(true);
                            }}
                        >
                            {translate('View_EditBatch_Button_DeleteBatch')}
                        </Button>
                    </PageHeader>

                    <PageContent>
                        <InputContainer>
                            <ProductHeader>
                                {!!product && (
                                    <ProductName>{product.name}</ProductName>
                                )}
                                {!!product && !!product.code && (
                                    <ProductCode>{product.code}</ProductCode>
                                )}
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
                                            'View_EditBatch_InputPlacehoder_Batch'
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
                                            'View_EditBatch_InputPlacehoder_Amount'
                                        )}
                                        keyboardType="numeric"
                                        value={String(amount)}
                                        onChangeText={handleAmountChange}
                                    />
                                </InputTextContainer>
                            </InputGroup>

                            <NumericInputField
                                type="currency"
                                locale="pt-BR"
                                currency={currency}
                                value={price}
                                onUpdate={(value: number) => setPrice(value)}
                                placeholder={translate(
                                    'View_EditBatch_InputPlacehoder_UnitPrice'
                                )}
                            />

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <RadioButton
                                        value="tratado"
                                        status={
                                            tratado === true
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setTratado(true)}
                                    />
                                    <RadioButtonText>
                                        {translate(
                                            'View_EditBatch_RadioButton_Treated'
                                        )}
                                    </RadioButtonText>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <RadioButton
                                        value="Não tratado"
                                        status={
                                            tratado === !true
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setTratado(false)}
                                    />
                                    <RadioButtonText>
                                        {translate(
                                            'View_EditBatch_RadioButton_NotTreated'
                                        )}
                                    </RadioButtonText>
                                </View>
                            </View>

                            <ExpDateGroup>
                                <ExpDateLabel>
                                    {translate('View_EditBatch_CalendarTitle')}
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
                            text={translate('View_EditBatch_Button_Save')}
                            onPress={handleSave}
                        />
                    </PageContent>
                </ScrollView>

                {!!error && (
                    <Notification
                        NotificationMessage={error}
                        NotificationType="error"
                        onPress={handleDimissNotification}
                    />
                )}
            </Container>

            <Dialog
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
                style={{ backgroundColor: theme.colors.productBackground }}
            >
                <Dialog.Title>
                    {translate('View_EditBatch_WarningDelete_Title')}
                </Dialog.Title>
                <Dialog.Content>
                    <Text style={{ color: theme.colors.text }}>
                        {translate('View_EditBatch_WarningDelete_Message')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button color="red" onPress={handleDelete}>
                        {translate(
                            'View_EditBatch_WarningDelete_Button_Confirm'
                        )}
                    </Button>
                    <Button
                        color={theme.colors.accent}
                        onPress={() => {
                            setDeleteComponentVisible(false);
                        }}
                    >
                        {translate(
                            'View_EditBatch_WarningDelete_Button_Cancel'
                        )}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};

export default EditBatch;
