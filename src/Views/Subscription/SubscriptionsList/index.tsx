import React, { useCallback, useEffect, useState } from 'react';

import { showMessage } from 'react-native-flash-message';

import { FlatList } from 'react-native';
import {
    getOfferings,
    makePurchase,
    CatPackage,
} from '~/Functions/Team/Subscriptions';

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

    const [offers, setOffers] = useState<Array<CatPackage>>([]);
    const [selected, setSelected] = useState('');

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getOfferings();

            setOffers(response);
            if (response.length > 0) {
                setSelected(response[0].package.offeringIdentifier);
            }
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

            const selectedOffer = offers.find(
                id => id.package.offeringIdentifier === selected
            );

            if (!selectedOffer) {
                showMessage({
                    message: 'Package was not found',
                    type: 'danger',
                });
                return;
            }

            await makePurchase(selectedOffer.package);
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

    const renderItem = useCallback(
        ({ item }) => {
            const { package: pack, type } = item;

            const { introPrice } = pack.product;
            const price = pack.product.price_string;

            return (
                <SubscriptionContainer
                    onPress={() =>
                        handleSelectedChange(pack.offeringIdentifier)
                    }
                    isSelected={selected === pack.offeringIdentifier}
                    key={pack.offeringIdentifier}
                >
                    <SubscriptionPeriodContainer>
                        <TextSubscription>{type}</TextSubscription>
                    </SubscriptionPeriodContainer>

                    <DetailsContainer>
                        <SubscriptionDescription
                            isSelected={selected === pack.offeringIdentifier}
                        >
                            <TextSubscription>
                                {introPrice &&
                                    `${introPrice.priceString} no primeiro mês, depois `}
                                {`${price} mensais`}
                            </TextSubscription>
                        </SubscriptionDescription>
                    </DetailsContainer>
                </SubscriptionContainer>
            );
        },
        [handleSelectedChange, selected]
    );

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            {offers.length > 0 && (
                <>
                    <SubscriptionsGroup>
                        <FlatList
                            data={offers}
                            keyExtractor={(item, index) => String(index)}
                            horizontal
                            renderItem={renderItem}
                        />
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
