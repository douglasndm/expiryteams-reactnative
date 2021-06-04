import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { Dialog } from 'react-native-paper';
import { useTheme } from 'styled-components';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    deleteBatch,
    getBatch,
    updateBatch,
} from '~/Functions/Products/Batches/Batch';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import BackButton from '~/Components/BackButton';

import {
    Container,
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
import {
    ActionsButtonContainer,
    ButtonPaper,
} from '~/Views/Product/Edit/styles';
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
    productId: string;
    batchId: string;
}

const EditBatch: React.FC = () => {
    const route = useRoute();
    const { reset, goBack } = useNavigation();

    const { preferences } = useContext(PreferencesContext);

    const routeParams = route.params as Props;

    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    const userRole = useMemo(() => {
        return preferences.selectedTeam.role.toLowerCase();
    }, [preferences.selectedTeam.role]);

    const productId = useMemo(() => {
        return routeParams.productId;
    }, [routeParams]);

    const batchId = useMemo(() => {
        return routeParams.batchId;
    }, [routeParams]);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const theme = useTheme();

    const [product, setProduct] = useState<IProduct | null>(null);
    const [batch, setBatch] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState<number | null>(null);

    const [expDate, setExpDate] = useState(new Date());
    const [status, setStatus] = useState<'checked' | 'unchecked'>('unchecked');

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getBatch({ batch_id: batchId });

            setProduct(response.product);
            setBatch(response.batch.name);
            setStatus(response.batch.status);
            if (response.batch.amount) setAmount(String(response.batch.amount));

            if (response.batch.price) {
                const p = parseFloat(
                    String(response.batch.price).replace(/\$/g, '')
                );

                setPrice(p);
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [batchId]);

    const handleUpdate = useCallback(async () => {
        if (!batch || batch.trim() === '') {
            Alert.alert(translate('View_EditBatch_Error_BatchWithNoName'));
            return;
        }

        try {
            const response = await updateBatch({
                batch: {
                    id: batchId,
                    name: batch,
                    amount: Number(amount),
                    exp_date: String(expDate),
                    price: price || undefined,
                    status,
                },
            });

            if ('error' in response) {
                showMessage({
                    message: response.error,
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
                        params: { productId, type: 'edit_batch' },
                    },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [amount, batch, batchId, expDate, price, productId, reset, status]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = useCallback(async () => {
        try {
            await deleteBatch({ batch_id: batchId });

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'Success', params: { type: 'delete_batch' } },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [batchId, reset]);

    const handleBatchChange = useCallback(value => {
        setBatch(value);
    }, []);

    const handleAmountChange = useCallback(value => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
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
                                        value={batch}
                                        onChangeText={handleBatchChange}
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

                            <Currency
                                value={price}
                                onChangeValue={handlePriceChange}
                                delimiter={currency === 'BRL' ? ',' : '.'}
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
                                        value="checked"
                                        status={
                                            status === 'checked'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setStatus('checked')}
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
                                        value="unchecked"
                                        status={
                                            status !== 'checked'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setStatus('unchecked')}
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
                                    onDateChange={value => {
                                        setExpDate(value);
                                    }}
                                    locale={locale}
                                />
                            </ExpDateGroup>
                        </InputContainer>

                        <ActionsButtonContainer>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="save-outline" size={22} />
                                )}
                                onPress={handleUpdate}
                            >
                                {translate('View_EditBatch_Button_Save')}
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
                                    {translate(
                                        'View_EditBatch_Button_DeleteBatch'
                                    )}
                                </ButtonPaper>
                            )}

                            <ButtonPaper
                                icon={() => (
                                    <Icons name="exit-outline" size={22} />
                                )}
                                onPress={goBack}
                            >
                                {translate('View_EditProduct_Button_Cancel')}
                            </ButtonPaper>
                        </ActionsButtonContainer>
                    </PageContent>
                </ScrollView>
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
