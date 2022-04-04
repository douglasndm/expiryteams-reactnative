import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format, parseISO } from 'date-fns';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '~/Contexts/TeamContext';

import { getTeamSubscription } from '~/Functions/Team/Subscriptions';

import Button from '~/Components/Button';
import Loading from '~/Components/Loading';

import { Section, SectionTitle } from '../../styles';

import {
    SubscriptionDescription,
    SubscriptionTableTitle,
    SubscriptionContainer,
    SubscriptionInformations,
} from './styles';

const Subscriptions: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const [
        subscription,
        setSubscription,
    ] = useState<ITeamSubscription | null>();

    const teamContext = useTeam();

    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadData = useCallback(async () => {
        if (!isMounted || !teamContext.id) return;
        try {
            setIsLoading(true);

            const sub = await getTeamSubscription(teamContext.id);

            setSubscription(sub);
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

    useEffect(() => {
        loadData();
    }, []);

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
                        <SubscriptionInformations>{`Sua assinatura possui ${
                            subscription.membersLimit
                        } membros e está ativa até ${format(
                            parseISO(String(subscription.expireIn)),
                            'dd/MM/yyyy'
                        )}`}</SubscriptionInformations>
                    </SubscriptionContainer>
                </>
            )}
        </Section>
    );
};

export default Subscriptions;
