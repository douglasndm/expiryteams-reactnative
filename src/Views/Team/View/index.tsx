import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTeam } from '~/Contexts/TeamContext';

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

    const teamContext = useTeam();

    const isManager = useMemo(() => {
        if (teamContext.id) {
            if (teamContext.roleInTeam?.role.toLowerCase() === 'manager') {
                return true;
            }
        }
        return false;
    }, [teamContext.id, teamContext.roleInTeam]);

    const handleNavigateToMembers = useCallback(() => {
        navigate('ListUsersFromTeam');
    }, [navigate]);

    return (
        <Container>
            <PageHeader>
                {teamContext.active && (
                    <BackButton
                        handleOnPress={goBack}
                        contentStyle={{ marginLeft: -10 }}
                    />
                )}

                <PageTitle>Detalhes do time</PageTitle>
            </PageHeader>

            <PageContent>
                {!!teamContext.name && (
                    <View>
                        <TeamName>{teamContext.name}</TeamName>
                        {isManager && <Subscriptions />}
                    </View>
                )}

                {teamContext.active && (
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
