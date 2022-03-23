import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format, parseISO, startOfDay, compareAsc } from 'date-fns';
import { showMessage } from 'react-native-flash-message';

import { getTeamSubscriptions } from '~/Functions/Team/Subscriptions';
import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

import Button from '~/Components/Button';
import Loading from '~/Components/Loading';

import { Section, SectionTitle } from '../../styles';

import {
    SubscriptionDescription,
    SubscriptionTableTitle,
    SubscriptionContainer,
    SubscriptionsTable,
    SubscriptionHeader,
    SubscriptionText,
} from './styles';

const Subscriptions: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const [
        subscription,
        setSubscription,
    ] = useState<ITeamSubscription | null>();

    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadData = useCallback(async () => {
        if (!isMounted) return;
        try {
            setIsLoading(true);
            const selectedTeam = await getSelectedTeam();

            if (!selectedTeam) {
                return;
            }

            const response = await getTeamSubscriptions({
                team_id: selectedTeam.userRole.team.id,
            });

            if (response) {
                if (
                    compareAsc(
                        startOfDay(new Date()),
                        startOfDay(parseISO(String(response.expireIn)))
                    ) >= 0
                ) {
                    setSubscription(response);
                    return;
                }
            }

            setSubscription(null);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [isMounted]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        return () => {
            setIsMounted(false);
        };
    }, []);

    const handleNavigatePurchase = useCallback(() => {
        navigate('Subscription');
    }, [navigate]);

    return isLoading ? (
        <Loading />
    ) : (
        <Section>
            <SectionTitle>Assinaturas</SectionTitle>

            <SubscriptionDescription>
                Com uma assinatura você pode manter um time e adicionar pessoas
                a ele. Todas as mudanças feitas serão refletidas em todos os
                dispositivos
            </SubscriptionDescription>

            <Button
                text={!subscription ? 'Ver planos' : 'Mudar plano'}
                onPress={handleNavigatePurchase}
            />

            {subscription && (
                <>
                    <SubscriptionTableTitle>
                        Sua assinatura
                    </SubscriptionTableTitle>

                    <SubscriptionContainer>
                        <SubscriptionsTable>
                            <SubscriptionsTable.Header>
                                <SubscriptionHeader>#</SubscriptionHeader>
                                <SubscriptionHeader>Membros</SubscriptionHeader>
                                <SubscriptionHeader>
                                    Expira em
                                </SubscriptionHeader>
                            </SubscriptionsTable.Header>

                            {!!subscription && (
                                <SubscriptionsTable.Row>
                                    <SubscriptionsTable.Cell>
                                        <SubscriptionText>
                                            Plano
                                        </SubscriptionText>
                                    </SubscriptionsTable.Cell>
                                    <SubscriptionsTable.Cell>
                                        <SubscriptionText>
                                            {subscription.membersLimit}
                                        </SubscriptionText>
                                    </SubscriptionsTable.Cell>
                                    <SubscriptionsTable.Cell>
                                        <SubscriptionText>
                                            {format(
                                                parseISO(
                                                    String(
                                                        subscription.expireIn
                                                    )
                                                ),
                                                'dd/MM/yyyy'
                                            )}
                                        </SubscriptionText>
                                    </SubscriptionsTable.Cell>
                                </SubscriptionsTable.Row>
                            )}
                        </SubscriptionsTable>
                    </SubscriptionContainer>
                </>
            )}
        </Section>
    );
};

export default Subscriptions;
