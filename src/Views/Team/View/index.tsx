import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO, startOfDay, compareAsc } from 'date-fns';

import { showMessage } from 'react-native-flash-message';
import PreferencesContext from '~/Contexts/PreferencesContext';

import { getTeamSubscriptions } from '~/Functions/Team/Subscriptions';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';
import Loading from '~/Components/Loading';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    Section,
    SectionTitle,
    SubscriptionDescription,
    SubscriptionContainer,
    SubscriptionTableTitle,
    SubscriptionsTable,
    SubscriptionHeader,
    SubscriptionText,
    TeamName,
} from './styles';

const ViewTeam: React.FC = () => {
    const { goBack, navigate } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPurchaseLoading, setIsPurchaseLoading] = useState<boolean>(false);

    const [subs, setSubs] = useState<Array<ITeamSubscription>>([]);

    const { preferences } = useContext(PreferencesContext);

    const loadData = useCallback(async () => {
        if (!preferences.selectedTeam) {
            showMessage({
                message: 'Nenhum time selecionado',
                type: 'danger',
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await getTeamSubscriptions({
                team_id: preferences.selectedTeam.team.id,
            });

            const activeSubs = response.filter(
                sub =>
                    compareAsc(
                        startOfDay(new Date()),
                        startOfDay(parseISO(String(sub.expireIn)))
                    ) <= 0
            );

            setSubs(activeSubs);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [preferences.selectedTeam]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handlePurchase = useCallback(async () => {
        try {
            setIsPurchaseLoading(true);
            navigate('Subscription');
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsPurchaseLoading(false);
        }
    }, [navigate]);

    const handleNavigateToMembers = useCallback(() => {
        navigate('ListUsersFromTeam');
    }, [navigate]);

    interface renderProps {
        item: ITeamSubscription;
        index: number;
    }

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <PageHeader>
                <BackButton handleOnPress={goBack} />
                <PageTitle>Detalhes do time</PageTitle>
            </PageHeader>

            <PageContent>
                {preferences.selectedTeam && (
                    <View>
                        <TeamName>
                            {preferences.selectedTeam.team.name}
                        </TeamName>
                        {preferences.selectedTeam.role === 'manager' && (
                            <Section>
                                <SectionTitle>Assinaturas</SectionTitle>

                                <SubscriptionDescription>
                                    Com uma assinatura você tem a possibilidade
                                    de criar um time com até 5 pessoas e todas
                                    as modificações feitas por elas são
                                    sincronizadas entre todos os dispositivos.
                                </SubscriptionDescription>

                                {subs.length <= 0 && (
                                    <Button
                                        text="Ver planos"
                                        isLoading={isPurchaseLoading}
                                        onPress={handlePurchase}
                                    />
                                )}

                                <SubscriptionTableTitle>
                                    Suas assinaturas
                                </SubscriptionTableTitle>

                                <SubscriptionContainer>
                                    <SubscriptionsTable>
                                        <SubscriptionsTable.Header>
                                            <SubscriptionHeader>
                                                #
                                            </SubscriptionHeader>
                                            <SubscriptionHeader>
                                                Membros
                                            </SubscriptionHeader>
                                            <SubscriptionHeader>
                                                Expira em
                                            </SubscriptionHeader>
                                        </SubscriptionsTable.Header>

                                        {subs.map(sub => {
                                            const date = format(
                                                parseISO(String(sub.expireIn)),
                                                'dd/MM/yyyy'
                                            );

                                            return (
                                                <SubscriptionsTable.Row
                                                    key={sub.id}
                                                >
                                                    <SubscriptionsTable.Cell>
                                                        <SubscriptionText>
                                                            {1}
                                                        </SubscriptionText>
                                                    </SubscriptionsTable.Cell>
                                                    <SubscriptionsTable.Cell>
                                                        <SubscriptionText>
                                                            {sub.membersLimit}
                                                        </SubscriptionText>
                                                    </SubscriptionsTable.Cell>
                                                    <SubscriptionsTable.Cell>
                                                        <SubscriptionText>
                                                            {date}
                                                        </SubscriptionText>
                                                    </SubscriptionsTable.Cell>
                                                </SubscriptionsTable.Row>
                                            );
                                        })}
                                    </SubscriptionsTable>
                                </SubscriptionContainer>
                            </Section>
                        )}
                    </View>
                )}

                <Section>
                    <SectionTitle>Membros</SectionTitle>

                    <SubscriptionDescription>
                        Membros atuais do time
                    </SubscriptionDescription>

                    <Button
                        text="Ver membros"
                        onPress={handleNavigateToMembers}
                    />
                </Section>
            </PageContent>
        </Container>
    );
};

export default ViewTeam;
