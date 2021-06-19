import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO, startOfDay, compareAsc } from 'date-fns';

import { showMessage } from 'react-native-flash-message';
import PreferencesContext from '~/Contexts/PreferencesContext';

import { getTeamSubscriptions } from '~/Functions/Team/Subscriptions';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';
import Loading from '~/Components/Loading';

import Advenced from './Components/Advenced';

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

    const { preferences } = useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPurchaseLoading, setIsPurchaseLoading] = useState<boolean>(false);

    const [subs, setSubs] = useState<ITeamSubscription | null>();

    const isManager = useMemo(() => {
        if (preferences.selectedTeam) {
            if (preferences.selectedTeam.role.toLowerCase() === 'manager') {
                return true;
            }
        }
        return false;
    }, [preferences.selectedTeam]);

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

            if (response) {
                if (
                    compareAsc(
                        startOfDay(new Date()),
                        startOfDay(parseISO(String(response.expireIn)))
                    ) >= 0
                ) {
                    setSubs(response);
                    return;
                }
            }

            setSubs(null);
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
                        {isManager && (
                            <Section>
                                <SectionTitle>Assinaturas</SectionTitle>

                                <SubscriptionDescription>
                                    Com uma assinatura você tem a possibilidade
                                    de criar um time com até 5 pessoas e todas
                                    as modificações feitas por elas são
                                    sincronizadas entre todos os dispositivos.
                                </SubscriptionDescription>

                                <Button
                                    text={!subs ? 'Ver planos' : 'Mudar plano'}
                                    isLoading={isPurchaseLoading}
                                    onPress={handlePurchase}
                                />

                                <SubscriptionTableTitle>
                                    Sua assinatura
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

                                        {!!subs && (
                                            <SubscriptionsTable.Row>
                                                <SubscriptionsTable.Cell>
                                                    <SubscriptionText>
                                                        Plano
                                                    </SubscriptionText>
                                                </SubscriptionsTable.Cell>
                                                <SubscriptionsTable.Cell>
                                                    <SubscriptionText>
                                                        {subs.membersLimit}
                                                    </SubscriptionText>
                                                </SubscriptionsTable.Cell>
                                                <SubscriptionsTable.Cell>
                                                    <SubscriptionText>
                                                        {format(
                                                            parseISO(
                                                                String(
                                                                    subs.expireIn
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

                {isManager && <Advenced />}
            </PageContent>
        </Container>
    );
};

export default ViewTeam;
