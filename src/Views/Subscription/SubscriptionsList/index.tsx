import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { CatPackage } from '~/@types/Functions/Subscriptions';

import {
    getOfferings,
    makePurchase,
    getTeamSubscription,
} from '~/Functions/Team/Subscriptions';
import {
    getSelectedTeam,
    setSelectedTeam,
} from '~/Functions/Team/SelectedTeam';

import Loading from '~/Components/Loading';

import {
    Container,
    SubscriptionsGroup,
    SubscriptionContainer,
    SubscriptionPeriodContainer,
    TeamMembersLimit,
    DetailsContainer,
    SubscriptionDescription,
    ButtonSubscription,
    TextSubscription,
    ButtonText,
} from './styles';

const SubscriptionsList: React.FC = () => {
    const { reset } = useNavigation();

    const teamContext = useTeam();

    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [offers, setOffers] = useState<Array<CatPackage>>([]);
    const [selected, setSelected] = useState('');

    const loadData = useCallback(async () => {
        if (!isMounted) return;
        if (!teamContext.id) {
            showMessage({
                message: 'Team is not selected',
                type: 'danger',
            });
            return;
        }
        try {
            setIsLoading(true);

            const response = await getOfferings();

            setOffers(response);
            if (response.length > 0) {
                setSelected(response[0].package.offeringIdentifier);
            }

            await getTeamSubscription(teamContext.id);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [isMounted, teamContext.id]);

    const handleSelectedChange = useCallback((identifier: string) => {
        setSelected(identifier);
    }, []);

    const handlePurchase = useCallback(async () => {
        if (!teamContext.id || !teamContext.roleInTeam || !teamContext.reload) {
            return;
        }

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

            const purchase = await makePurchase({
                pack: selectedOffer.package,
                team_id: teamContext.id,
            });

            if (purchase) {
                showMessage({
                    message: 'Assinatura realizada com sucesso!',
                    type: 'info',
                });

                const selectedTeam = await getSelectedTeam();

                if (selectedTeam)
                    await setSelectedTeam({
                        userRole: {
                            ...selectedTeam.userRole,
                            team: {
                                ...selectedTeam.userRole.team,
                                isActive: true,
                                subscription: {
                                    expireIn: purchase.expireIn,
                                    membersLimit: purchase.membersLimit,
                                },
                            },
                        },
                        teamPreferences: selectedTeam.teamPreferences,
                    });

                teamContext.reload();

                reset({
                    routes: [
                        {
                            name: 'Routes',
                            state: {
                                routes: [{ name: 'Home' }],
                            },
                        },
                    ],
                });
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [teamContext, offers, selected, reset]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        return () => {
            setIsMounted(false);
        };
    }, []);

    const renderItem = useCallback(
        ({ item }) => {
            const { package: pack, type } = item;

            const { introPrice } = pack.product;
            const price = pack.product.price_string;

            let limit = strings.Subscription_TeamLimit_1person;

            switch (type) {
                case '2 people':
                    limit = strings.Subscription_TeamLimit_2people;
                    break;
                case '3 people':
                    limit = strings.Subscription_TeamLimit_3people;
                    break;
                case '5 people':
                    limit = strings.Subscription_TeamLimit_5people;
                    break;
                case '10 people':
                    limit = strings.Subscription_TeamLimit_10people;
                    break;
                case '15 people':
                    limit = strings.Subscription_TeamLimit_15people;
                    break;
                case '30 people':
                    limit = strings.Subscription_TeamLimit_30people;
                    break;
                case '45 people':
                    limit = strings.Subscription_TeamLimit_45people;
                    break;
                case '60 people':
                    limit = strings.Subscription_TeamLimit_60people;
                    break;
                default:
                    break;
            }

            const isSelected = selected === pack.offeringIdentifier;

            let text = ``;

            if (Platform.OS === 'android' && !!introPrice) {
                const introPriceStr =
                    introPrice.price > 0 ? introPrice.priceString : 'Teste';

                const periodUnit = pack.product.introPrice?.periodUnit;

                if (!!periodUnit && periodUnit === 'DAY') {
                    const period = pack.product.introPrice?.periodNumberOfUnits;

                    text = `${introPriceStr} nos primeiros ${period} dias, e depois `;
                } else {
                    text = `${introPriceStr} no primeiro mês, depois `;
                }
            }
            text += `${price} mensais`;

            return (
                <SubscriptionContainer
                    onPress={() =>
                        handleSelectedChange(pack.offeringIdentifier)
                    }
                    isSelected={isSelected}
                    key={pack.offeringIdentifier}
                >
                    <SubscriptionPeriodContainer isSelected={isSelected}>
                        <TeamMembersLimit isSelected={isSelected}>
                            {limit}
                        </TeamMembersLimit>
                    </SubscriptionPeriodContainer>

                    <DetailsContainer isSelected={isSelected}>
                        <SubscriptionDescription isSelected={isSelected}>
                            <TextSubscription isSelected={isSelected}>
                                {text}
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
                        <ButtonText>Assinar</ButtonText>
                    </ButtonSubscription>
                </>
            )}

            {offers.length <= 0 && (
                <ButtonSubscription disabled>
                    <TextSubscription style={{ color: '#fff' }}>
                        A loja não está disponível no momento.
                    </TextSubscription>
                </ButtonSubscription>
            )}
        </Container>
    );
};

export default SubscriptionsList;
