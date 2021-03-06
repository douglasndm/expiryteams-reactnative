import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';
import { parseISO } from 'date-fns';

import { StackNavigationProp } from '@react-navigation/stack';
import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import {
    deleteBatch,
    getBatch,
    updateBatch,
} from '~/Functions/Products/Batches/Batch';

import Header from '~/Components/Header';
import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';

import {
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
    Container,
    PageTitleContainer,
    ContentHeader,
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
    const { replace } = useNavigation<StackNavigationProp<RoutesParams>>();

    const teamContext = useTeam();

    const routeParams = route.params as Props;

    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

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
        if (!teamContext.roleInTeam) {
            return null;
        }
        return teamContext.roleInTeam.role.toLowerCase();
    }, [teamContext.roleInTeam]);

    const productId = useMemo(() => {
        return routeParams.productId;
    }, [routeParams]);

    const batchId = useMemo(() => {
        return routeParams.batchId;
    }, [routeParams]);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [product, setProduct] = useState<IProduct | null>(null);
    const [batch, setBatch] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState<number | null>(null);

    const [expDate, setExpDate] = useState(new Date());
    const [status, setStatus] = useState<'checked' | 'unchecked'>('unchecked');

    const loadData = useCallback(async () => {
        if (!isMounted) return;
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
            setExpDate(parseISO(response.batch.exp_date));
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [batchId, isMounted]);

    const handleUpdate = useCallback(async () => {
        if (!isMounted) return;
        if (!batch || batch.trim() === '') {
            Alert.alert(strings.View_EditBatch_Error_BatchWithNoName);
            return;
        }

        try {
            setIsUpdating(true);
            await updateBatch({
                batch: {
                    id: batchId,
                    name: batch,
                    amount: Number(amount),
                    exp_date: String(expDate),
                    price: price || undefined,
                    status,
                },
            });

            showMessage({
                message: strings.View_Success_BatchUpdated,
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
            setIsUpdating(false);
        }
    }, [
        amount,
        batch,
        batchId,
        expDate,
        isMounted,
        price,
        productId,
        replace,
        status,
    ]);

    useEffect(() => {
        loadData();

        return () => setIsMounted(false);
    }, [loadData]);

    const handleDelete = useCallback(async () => {
        if (!isMounted) return;
        try {
            setIsLoading(true);
            await deleteBatch({ batch_id: batchId });

            showMessage({
                message: strings.View_Success_BatchDeleted,
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
            setIsLoading(false);
        }
    }, [batchId, isMounted, productId, replace]);

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

    const handleSwitchShowDeleteBatch = useCallback(() => {
        setDeleteComponentVisible(!deleteComponentVisible);
    }, [deleteComponentVisible]);

    return isLoading || isUpdating ? (
        <Loading />
    ) : (
        <Container>
            <StatusBar />
            <ScrollView>
                <PageTitleContainer>
                    <Header title={strings.View_EditBatch_PageTitle} noDrawer />

                    <ActionsButtonContainer>
                        <ButtonPaper
                            icon={() => <Icons name="save-outline" size={22} />}
                            onPress={handleUpdate}
                        >
                            {strings.View_EditBatch_Button_Save}
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
                                {strings.View_EditBatch_Button_DeleteBatch}
                            </ButtonPaper>
                        )}
                    </ActionsButtonContainer>
                </PageTitleContainer>

                <PageContent>
                    <InputContainer>
                        <ContentHeader>
                            <ProductHeader>
                                {!!product && (
                                    <ProductName>{product.name}</ProductName>
                                )}
                                {!!product && !!product.code && (
                                    <ProductCode>{product.code}</ProductCode>
                                )}
                            </ProductHeader>
                        </ContentHeader>

                        <InputGroup>
                            <InputTextContainer
                                style={{
                                    flex: 5,
                                    marginRight: 5,
                                }}
                            >
                                <InputText
                                    placeholder={
                                        strings.View_EditBatch_InputPlacehoder_Batch
                                    }
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
                                    placeholder={
                                        strings.View_EditBatch_InputPlacehoder_Amount
                                    }
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
                            placeholder={
                                strings.View_EditBatch_InputPlacehoder_UnitPrice
                            }
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
                                    {strings.View_EditBatch_RadioButton_Treated}
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
                                    {
                                        strings.View_EditBatch_RadioButton_NotTreated
                                    }
                                </RadioButtonText>
                            </View>
                        </View>

                        <ExpDateGroup>
                            <ExpDateLabel>
                                {strings.View_EditBatch_CalendarTitle}
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
                </PageContent>
            </ScrollView>
            <Dialog.Container
                visible={deleteComponentVisible}
                onBackdropPress={handleSwitchShowDeleteBatch}
            >
                <Dialog.Title>
                    {strings.View_EditBatch_WarningDelete_Title}
                </Dialog.Title>
                <Dialog.Description>
                    {strings.View_EditBatch_WarningDelete_Message}
                </Dialog.Description>
                <Dialog.Button
                    label={strings.View_EditBatch_WarningDelete_Button_Cancel}
                    onPress={handleSwitchShowDeleteBatch}
                />
                <Dialog.Button
                    label={strings.View_EditBatch_WarningDelete_Button_Confirm}
                    color="red"
                    onPress={handleDelete}
                />
            </Dialog.Container>
        </Container>
    );
};

export default EditBatch;
