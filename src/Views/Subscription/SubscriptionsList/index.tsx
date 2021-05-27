import React, { useCallback, useEffect, useState } from 'react';
import { PurchasesPackage } from 'react-native-purchases';
import { showMessage } from 'react-native-flash-message';

import { getOfferings, makePurchase } from '~/Functions/Team/Subscriptions';

import Loading from '~/Components/Loading';

import {
    Container,
    SubscriptionsGroup,
    SubscriptionContainer,
    SubscriptionPeriodContainer,
    DetailsContainer,
    SubscriptionDescription,
    ButtonSubscription,
    TextSubscription,
} from './styles';

const SubscriptionsList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [offers, setOffers] = useState<Array<PurchasesPackage>>([]);
    const [selected, setSelected] = useState('');

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getOfferings();

            setOffers(response);
            setSelected(response[0].identifier);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectedChange = useCallback((identifier: string) => {
        setSelected(identifier);
    }, []);

    const handlePurchase = useCallback(async () => {
        try {
            setIsLoading(true);

            const selectedOffer = offers.find(id => id.identifier === selected);

            if (!selectedOffer) {
                showMessage({
                    message: 'Package was not found',
                    type: 'danger',
                });
                return;
            }

            await makePurchase(selectedOffer);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [offers, selected]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            {offers.length > 0 && (
                <>
                    <SubscriptionsGroup>
                        {offers.map(offer => {
                            const { introPrice } = offer.product;
                            const price = offer.product.price_string;

                            return (
                                <SubscriptionContainer
                                    onPress={() =>
                                        handleSelectedChange(offer.identifier)
                                    }
                                    isSelected={selected === offer.identifier}
                                    key={offer.identifier}
                                >
                                    <SubscriptionPeriodContainer>
                                        <TextSubscription>
                                            5 usuários
                                        </TextSubscription>
                                    </SubscriptionPeriodContainer>

                                    <DetailsContainer>
                                        <SubscriptionDescription isSelected>
                                            <TextSubscription>
                                                {introPrice &&
                                                    `${introPrice.priceString} no primeiro mês, depois `}
                                                {`${price} mensais`}
                                            </TextSubscription>
                                        </SubscriptionDescription>
                                    </DetailsContainer>
                                </SubscriptionContainer>
                            );
                        })}
                    </SubscriptionsGroup>

                    <ButtonSubscription
                        onPress={handlePurchase}
                        disabled={isLoading}
                    >
                        <TextSubscription>Assinar</TextSubscription>
                    </ButtonSubscription>
                </>
            )}

            {offers.length <= 0 && (
                <ButtonSubscription disabled>
                    <TextSubscription>
                        A loja não está disponível no momento.
                    </TextSubscription>
                </ButtonSubscription>
            )}
        </Container>
    );
};

export default SubscriptionsList;
