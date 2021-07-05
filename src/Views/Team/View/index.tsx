import React, { useCallback, useMemo } from 'react';

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
    ActionsButtonContainer,
    ButtonPaper,
    Icons,
    TeamHeaderContainer,
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

    const handleNavigateEditTeam = useCallback(() => {
        navigate('EditTeam');
    }, [navigate]);

    const handleNavigateTeams = useCallback(() => {
        navigate('TeamList');
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
                <TeamHeaderContainer>
                    {!!teamContext.name && (
                        <TeamName>{teamContext.name}</TeamName>
                    )}

                    {teamContext.active && isManager && (
                        <ActionsButtonContainer>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="create-outline" size={22} />
                                )}
                                onPress={handleNavigateEditTeam}
                            >
                                Editar
                            </ButtonPaper>
                        </ActionsButtonContainer>
                    )}

                    {!teamContext.active && (
                        <ActionsButtonContainer>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="list-outline" size={22} />
                                )}
                                onPress={handleNavigateTeams}
                            >
                                Trocar time
                            </ButtonPaper>
                        </ActionsButtonContainer>
                    )}
                </TeamHeaderContainer>

                {isManager && <Subscriptions />}

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
