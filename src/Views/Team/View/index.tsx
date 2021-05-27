import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

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
    SubscriptionPrice,
    SubscriptionContainer,
    SubscriptionTableTitle,
    SubscriptionsTable,
    SubscriptionExpDate,
    SubscriptionLimit,
    TeamName,
} from './styles';

const View: React.FC = () => {
    const { goBack, navigate } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [subs, setSubs] = useState<Array<ITeamSubscription>>([]);
    const [isPurchaseLoading, setIsPurchaseLoading] = useState<boolean>(false);

    const { userPreferences } = useContext(PreferencesContext);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getTeamSubscriptions({
                team_id: userPreferences.selectedTeam.team.id,
            });

            setSubs(response);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [userPreferences.selectedTeam.team.id]);

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

    interface renderProps {
        item: ITeamSubscription;
        index: number;
    }

    const renderItem = useCallback((props: renderProps) => {
        const { index, item } = props;

        const date = format(parseISO(item.expireIn), 'dd/MM/yyyy');

        return (
            <SubscriptionContainer>
                <SubscriptionsTable>
                    <SubscriptionsTable.Header>
                        <SubscriptionsTable.Title>#</SubscriptionsTable.Title>
                        <SubscriptionsTable.Title>
                            Membros
                        </SubscriptionsTable.Title>
                        <SubscriptionsTable.Title>
                            Expira em
                        </SubscriptionsTable.Title>
                    </SubscriptionsTable.Header>

                    <SubscriptionsTable.Row>
                        <SubscriptionsTable.Cell>
                            {index + 1}
                        </SubscriptionsTable.Cell>
                        <SubscriptionsTable.Cell>
                            {item.membersLimit}
                        </SubscriptionsTable.Cell>
                        <SubscriptionsTable.Cell>
                            {date}
                        </SubscriptionsTable.Cell>
                    </SubscriptionsTable.Row>
                </SubscriptionsTable>
            </SubscriptionContainer>
        );
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <PageHeader>
                <BackButton handleOnPress={goBack} />
                <PageTitle>Detalhes do time</PageTitle>
            </PageHeader>

            <PageContent>
                <TeamName>{userPreferences.selectedTeam.team.name}</TeamName>
                <Section>
                    <SectionTitle>Assinaturas</SectionTitle>

                    <SubscriptionDescription>
                        Com uma assinatura você tem a possibilidade de criar um
                        time com até 5 pessoas e todas as modificações feitas
                        por elas são sincronizadas entre todos os dispositivos.
                    </SubscriptionDescription>

                    <Button
                        text="Ver planos"
                        isLoading={isPurchaseLoading}
                        onPress={handlePurchase}
                    />

                    <SubscriptionTableTitle>
                        Suas assinaturas
                    </SubscriptionTableTitle>
                    <FlatList data={subs} renderItem={renderItem} />
                </Section>
            </PageContent>
        </Container>
    );
};

export default View;
