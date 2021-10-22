import React, { useState, useCallback, useEffect, useRef } from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';
import { useTeam } from '~/Contexts/TeamContext';

import { getUserTeams } from '~/Functions/Team/Users';
import { setSelectedTeam } from '~/Functions/Team/SelectedTeam';

import Button from '~/Components/Button';
import Loading from '~/Components/Loading';

import {
    Container,
    Title,
    Content,
    EmptyText,
    ListTeamsTitle,
    ListCategories,
    TeamItemContainer,
    TeamItemTitle,
    TeamItemRole,
    Footer,
} from './styles';

const List: React.FC = () => {
    const { navigate, reset } = useNavigation();
    const { user } = useAuth();

    const teamContext = useTeam();

    const mounted = useRef(false);

    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState<boolean>(false);

    const [teams, setTeams] = useState<Array<IUserRoles>>([]);

    const [selectedTeamRole, setSelectedTeamRole] = useState<IUserRoles | null>(
        null
    );

    // This is for check if user is already manager on any team
    // If so, disable creating of new team
    // This is due limition of identify user and teams on revenuecat
    const [isManager, setIsManager] = useState<boolean>(false);

    const handleSetTeam = useCallback(
        (teamId: string) => {
            const selectedTeam = teams.find(t => t.team.id === teamId);

            if (!selectedTeam) {
                return;
            }

            setSelectedTeamRole(selectedTeam);
        },
        [teams]
    );

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    });

    const loadData = useCallback(async () => {
        if (!teamContext.isLoading) {
            try {
                setIsLoading(true);

                if (!user) {
                    return;
                }

                const response = await getUserTeams();

                if (mounted) {
                    response.forEach(item => {
                        if (item.role.toLowerCase() === 'manager') {
                            setIsManager(true);
                        }
                    });

                    const sortedTeams = response.sort((team1, team2) => {
                        if (team1.team.active && !team2.team.active) {
                            return 1;
                        }
                        if (team1.team.active && team2.team.active) {
                            return 0;
                        }
                        return -1;
                    });
                    setTeams(sortedTeams);

                    if (sortedTeams.length === 1) {
                        handleSetTeam(sortedTeams[0].team.id);
                    }
                }
            } catch (err) {
                if (err instanceof Error) {
                    showMessage({
                        message: err.message,
                        type: 'danger',
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
    }, [handleSetTeam, teamContext.isLoading, user]);

    const handleSelectedTeamChange = useCallback(async () => {
        if (!selectedTeamRole) {
            return;
        }
        await setSelectedTeam(selectedTeamRole);

        if (teamContext.reload) {
            teamContext.reload();
        } else {
            return;
        }

        if (!teamContext.isLoading) {
            reset({
                routes: [
                    {
                        name: 'Routes',
                        state: {
                            routes: [
                                {
                                    name: 'Home',
                                },
                            ],
                        },
                    },
                ],
            });
        }
    }, [reset, selectedTeamRole, teamContext]);

    useEffect(() => {
        if (selectedTeamRole) {
            handleSelectedTeamChange();
        }
    }, [handleSelectedTeamChange, selectedTeamRole]);

    const handleNavigateToEnterCode = useCallback(
        (userRole: IUserRoles) => {
            navigate('EnterTeam', { userRole });
        },
        [navigate]
    );

    interface renderProps {
        item: IUserRoles;
    }

    const renderCategory = useCallback(
        ({ item }: renderProps) => {
            const teamToNavigate = item.team.id;

            let role = item.role.toLowerCase();

            let isPending = true;

            if (item.status) {
                if (item.status.trim().toLowerCase() === 'completed') {
                    isPending = false;
                } else if (
                    item.status.trim().toLowerCase() !== 'completed' &&
                    role === 'manager'
                ) {
                    isPending = false;
                }
            } else if (role === 'manager') {
                isPending = false;
            }

            if (role === 'manager') {
                role = strings.UserInfo_Role_Manager;
            }
            if (role === 'supervisor') {
                role = strings.UserInfo_Role_Supervisor;
            }
            if (role === 'repositor') {
                role = strings.UserInfo_Role_Repositor;
            }

            function handleNavigate() {
                if (item.team.active !== true) {
                    if (item.role.toLowerCase() !== 'manager') {
                        showMessage({
                            message: 'O gerente precisa ativar o time.',
                            type: 'danger',
                        });
                        return;
                    }
                } else if (isPending) {
                    handleNavigateToEnterCode(item);
                    return;
                }
                handleSetTeam(teamToNavigate);
            }

            return (
                <TeamItemContainer
                    isPending={isPending || !item.team.active}
                    onPress={handleNavigate}
                >
                    <TeamItemTitle>{item.team.name}</TeamItemTitle>
                    <TeamItemRole>
                        {isPending
                            ? item.status.toUpperCase()
                            : role.toUpperCase()}
                    </TeamItemRole>
                </TeamItemContainer>
            );
        },
        [handleNavigateToEnterCode, handleSetTeam]
    );

    const handleNavigateCreateTeam = useCallback(() => {
        navigate('CreateTeam');
    }, [navigate]);

    const handleLogout = useCallback(() => {
        navigate('Logout');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await loadData();
        } finally {
            setRefreshing(false);
        }
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Title>{strings.View_TeamList_PageTitle}</Title>

            <Content>
                {teams.length <= 0 && (
                    <EmptyText>
                        Você não está em nenhum time no momento
                    </EmptyText>
                )}
                {teams.length > 0 && <ListTeamsTitle>Times</ListTeamsTitle>}

                <ListCategories
                    data={teams}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={renderCategory}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                />
            </Content>

            <Footer>
                {!isManager && (
                    <Button
                        text={strings.View_TeamList_Button_CreateTeam}
                        onPress={handleNavigateCreateTeam}
                        contentStyle={{ width: 150, marginBottom: 0 }}
                    />
                )}

                <Button
                    text="Sair da conta"
                    onPress={handleLogout}
                    contentStyle={{ width: 150 }}
                />
            </Footer>
        </Container>
    );
};

export default List;
