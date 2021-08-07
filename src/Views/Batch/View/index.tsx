import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
import {  format, parseISO } from 'date-fns';//eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line
import NumberFormat from 'react-number-format';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';

import { sendBatchNotification } from '~/Functions/Notifications/Batch';

import { PageTitle } from '~/Views/Product/Add/styles';

import {
    PageHeader,
    ActionsButtonContainer,
    ButtonPaper,
} from '~/Views/Product/Edit/styles';

import { PageTitleContainer, Icons } from '../Edit/styles';

import {
    Container,
    BatchContainer,
    BatchTitle,
    BatchExpDate,
    BatchAmount,
    BatchPrice,
} from './styles';

interface Props {
    product: string;
    batch: string;
}

const View: React.FC = () => {
    const { params } = useRoute();
    const { goBack, navigate } = useNavigation();

    const teamContext = useTeam();

    const routeParams = params as Props;

    const [isSendingNotification, setIsSendingNotification] = useState(false);
    const [isSharing, setIsSharing] = useState<boolean>(false);

    const prod = useMemo(() => {
        return JSON.parse(routeParams.product) as IProduct;
    }, [routeParams.product]);

    const userRole = useMemo(() => {
        if (teamContext.roleInTeam) {
            return teamContext.roleInTeam.role.toLowerCase();
        }
        return 'repositor';
    }, [teamContext.roleInTeam]);

    const languageCode = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return enUS;
        }
        return ptBR;
    }, []);

    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);
    const currencyPrefix = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return '$';
        }

        return 'R$';
    }, []);

    const batch = useMemo(() => {
        return JSON.parse(routeParams.batch) as IBatch;
    }, [routeParams.batch]);

    const handleNaviEdit = useCallback(() => {
        if (batch) {
            navigate('EditBatch', {
                productId: prod.id,
                batchId: batch.id,
            });
        }
    }, [batch, navigate, prod.id]);

    const handleSendNotification = useCallback(async () => {
        try {
            setIsSendingNotification(true);

            if (!batch) {
                return;
            }

            await sendBatchNotification({ batch_id: batch.id });

            showMessage({
                message: 'Notificação enviada',
                description: 'O time foi avisado sobre o lote',
                type: 'info',
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsSendingNotification(false);
        }
    }, [batch]);

    const handleShare = useCallback(async () => {
        try {
            setIsSharing(true);

            const expireDate = format(parseISO(batch.exp_date), dateFormat);

            let text = '';

            if (!!batch.amount && batch.amount > 0) {
                text = strings.View_ShareProduct_MessageWithAmount.replace(
                    '{PRODUCT}',
                    prod.name
                )
                    .replace('{AMOUNT}', String(batch.amount))
                    .replace('{DATE}', expireDate);
            } else {
                text = strings.View_ShareProduct_Message.replace(
                    '{PRODUCT}',
                    prod.name
                ).replace('{DATE}', expireDate);
            }

            await Share.open({
                title: strings.View_ShareProduct_Title,
                message: text,
            });
        } catch (err) {
            if (err.message !== 'User did not share') {
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
            }
        } finally {
            setIsSharing(false);
        }
    }, [batch.exp_date, batch.amount, dateFormat, prod.name]);

    const handleNavigateToDiscount = useCallback(() => {
        navigate('BatchDiscount', {
            batch: JSON.stringify(batch),
        });
    }, [batch, navigate]);

    return (
        <Container>
            <PageHeader>
                <PageTitleContainer>
                    <BackButton handleOnPress={goBack} />
                    <PageTitle>Lote</PageTitle>
                </PageTitleContainer>

                <ActionsButtonContainer>
                    <ButtonPaper
                        icon={() => <Icons name="create-outline" size={22} />}
                        onPress={handleNaviEdit}
                    >
                        Editar
                    </ButtonPaper>
                </ActionsButtonContainer>
            </PageHeader>

            {!!batch && (
                <BatchContainer>
                    <BatchTitle>{batch.name}</BatchTitle>

                    <BatchExpDate>
                        {`Vence em ${format(
                            parseISO(batch.exp_date),
                            dateFormat,
                            {
                                locale: languageCode,
                            }
                        )}`}
                    </BatchExpDate>

                    {!!batch.amount && (
                        <BatchAmount>Quantidade {batch.amount}</BatchAmount>
                    )}

                    {!!batch.price && (
                        <BatchPrice>
                            {`Preço unitário `}
                            <NumberFormat
                                value={batch.price}
                                displayType="text"
                                thousandSeparator
                                prefix={currencyPrefix}
                                renderText={value => value}
                                decimalScale={2}
                            />
                        </BatchPrice>
                    )}

                    {!!batch.price_tmp && (
                        <BatchPrice>
                            {`Preço temporário `}
                            <NumberFormat
                                value={batch.price_tmp}
                                displayType="text"
                                thousandSeparator
                                prefix={currencyPrefix}
                                renderText={value => value}
                                decimalScale={2}
                            />
                        </BatchPrice>
                    )}

                    {(userRole === 'manager' || userRole === 'supervisor') && (
                        <Button
                            text="Enviar notificação para o time"
                            onPress={handleSendNotification}
                            isLoading={isSendingNotification}
                            contentStyle={{ width: 250 }}
                        />
                    )}

                    <Button
                        text="Compartilhar com outros apps"
                        onPress={handleShare}
                        isLoading={isSharing}
                        contentStyle={{ marginTop: -5, width: 250 }}
                    />

                    <Button
                        text="Adicionar desconto"
                        onPress={handleNavigateToDiscount}
                        contentStyle={{ marginTop: -5, width: 250 }}
                    />
                </BatchContainer>
            )}
        </Container>
    );
};

export default View;
