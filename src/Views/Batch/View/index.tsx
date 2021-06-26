import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import {  format, parseISO } from 'date-fns';//eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line
import NumberFormat from 'react-number-format';

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
    productId: string;
    batch: string;
}

const View: React.FC = () => {
    const { params } = useRoute();
    const { goBack, navigate } = useNavigation();

    const routeParams = params as Props;

    const [isSendingNotification, setIsSendingNotification] = useState(false);

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
        if (routeParams.batch) {
            return JSON.parse(routeParams.batch) as IBatch;
        }

        return null;
    }, [routeParams.batch]);

    const handleNaviEdit = useCallback(() => {
        if (batch) {
            navigate('EditBatch', {
                productId: routeParams.productId,
                batchId: batch.id,
            });
        }
    }, [batch, navigate, routeParams.productId]);

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
            console.log(err);
        } finally {
            setIsSendingNotification(false);
        }
    }, [batch]);
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

                    <BatchAmount>Quantidade {batch.amount}</BatchAmount>

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

                    <Button
                        text="Enviar notificação para o time"
                        onPress={handleSendNotification}
                        isLoading={isSendingNotification}
                    />
                </BatchContainer>
            )}
        </Container>
    );
};

export default View;
