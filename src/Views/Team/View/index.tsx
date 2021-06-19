import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import PreferencesContext from '~/Contexts/PreferencesContext';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';

import Subscriptions from './Components/Subscriptions';
import Advenced from './Components/Advenced';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    Section,
    SectionTitle,
    SubscriptionDescription,
    TeamName,
} from './styles';

const ViewTeam: React.FC = () => {
    const { goBack, navigate } = useNavigation();

    const { preferences } = useContext(PreferencesContext);

    const isManager = useMemo(() => {
        if (preferences.selectedTeam) {
            if (preferences.selectedTeam.role.toLowerCase() === 'manager') {
                return true;
            }
        }
        return false;
    }, [preferences.selectedTeam]);

    const handleNavigateToMembers = useCallback(() => {
        navigate('ListUsersFromTeam');
    }, [navigate]);

    interface renderProps {
        item: ITeamSubscription;
        index: number;
    }

    return (
        <Container>
            <PageHeader>
                {preferences.selectedTeam?.team.active && (
                    <BackButton
                        handleOnPress={goBack}
                        contentStyle={{ marginLeft: -10 }}
                    />
                )}

                <PageTitle>Detalhes do time</PageTitle>
            </PageHeader>

            <PageContent>
                {preferences.selectedTeam && (
                    <View>
                        <TeamName>
                            {preferences.selectedTeam.team.name}
                        </TeamName>
                        {isManager && <Subscriptions />}
                    </View>
                )}

                {preferences.selectedTeam?.team.active && (
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
                )}

                {isManager && <Advenced />}
            </PageContent>
        </Container>
    );
};

export default ViewTeam;
