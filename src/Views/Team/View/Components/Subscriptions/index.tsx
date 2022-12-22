import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format, parseISO } from 'date-fns';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getTeamSubscription } from '~/Functions/Team/Subscriptions';

import Button from '@components/Button';
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

    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);

    const subExpDate = useMemo(() => {
        if (subscription) {
            return format(parseISO(String(subscription.expireIn)), dateFormat);
        }
        return null;
    }, [dateFormat, subscription]);

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
            <SectionTitle>
                {strings.View_TeamView_Subscription_Title}
            </SectionTitle>

            <SubscriptionDescription>
                {strings.View_TeamView_Subscription_Description}
            </SubscriptionDescription>

            <Button
                text={
                    !subscription
                        ? strings.View_TeamView_Subscription_Button_SeePlans
                        : strings.View_TeamView_Subscription_Button_ChangePlans
                }
                onPress={handleNavigatePurchase}
            />

            {subscription && !!subExpDate && (
                <>
                    <SubscriptionTableTitle>
                        {
                            strings.View_TeamView_Subscription_CurrentSubscription_Title
                        }
                    </SubscriptionTableTitle>

                    <SubscriptionContainer>
                        <SubscriptionInformations>
                            {strings.View_TeamView_Subscription_CurrentSubscription_Description.replace(
                                '{MEMBERS}',
                                String(subscription.membersLimit)
                            ).replace('{DATE}', subExpDate)}
                        </SubscriptionInformations>
                    </SubscriptionContainer>
                </>
            )}
        </Section>
    );
};

export default Subscriptions;
