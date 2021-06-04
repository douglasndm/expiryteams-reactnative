import React, { useCallback, useEffect, useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import Preferences from '~/Contexts/PreferencesContext';

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
    const { reset } = useNavigation();

    const { preferences } = useContext(Preferences);

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

            await makePurchase({
                pack: selectedOffer.package,
                team_id: preferences.selectedTeam.team.id,
            });

            showMessage({
                message: 'Assinatura realizada com sucesso!',
                type: 'info',
            });

            reset({
                routes: [{ name: 'Home' }],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [offers, reset, selected, preferences.selectedTeam.team.id]);

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
                            <TextSubscription
                                isSelected={
                                    selected === pack.offeringIdentifier
                                }
                            >
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
