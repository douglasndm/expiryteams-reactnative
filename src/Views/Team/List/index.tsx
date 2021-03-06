import React, { useState, useCallback, useEffect, memo } from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getUserTeams } from '~/Functions/Team/Users';
import { setSelectedTeam } from '~/Functions/Team/SelectedTeam';
import { getTeamPreferences } from '~/Functions/Team/Preferences';

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
    const { navigate, reset } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();
    const teamContext = useTeam();

    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [teams, setTeams] = useState<Array<IUserRoles>>([]);

    // This is for check if user is already manager on any team
    // If so, disable creating of new team
    // This is due limition of identify user and teams on revenuecat
    const [isManager, setIsManager] = useState<boolean>(false);

    const handleNavigateToEnterCode = useCallback(
        (userRole: IUserRoles) => {
            navigate('EnterTeam', { userRole });
        },
        [navigate]
    );

    const handleSelectTeam = useCallback(
        async (userRoles: IUserRoles) => {
            if (userRoles.team.isActive !== true) {
                if (userRoles.role.toLowerCase() !== 'manager') {
                    showMessage({
                        message:
                            strings.View_TeamList_Error_ManagerShouldActiveTeam,
                        type: 'warning',
                    });
                    return;
                }
            } else if (userRoles.status) {
                if (userRoles.status.toLowerCase() === 'pending') {
                    handleNavigateToEnterCode(userRoles);
                    return;
                }
            }

            if (userRoles.team) {
                const teamPreferences = await getTeamPreferences({
                    team_id: userRoles.team.id,
                });

                await setSelectedTeam({
                    userRole: userRoles,
                    teamPreferences,
                });

                if (teamContext.reload) {
                    teamContext.reload();
                } else {
                    return;
                }

                let routeName = 'Home';

                if (!userRoles.team.isActive) {
                    routeName = 'ViewTeam';
                }

                reset({
                    routes: [
                        {
                            name: 'Routes',
                            state: {
                                routes: [
                                    {
                                        name: routeName,
                                    },
                                ],
                            },
                        },
                    ],
                });
            }
        },
        [handleNavigateToEnterCode, reset, teamContext]
    );

    const loadData = useCallback(async () => {
        if (!isMounted) return;
        try {
            setIsLoading(true);

            const response = await getUserTeams();

            response.forEach(item => {
                if (item.role.toLowerCase() === 'manager') {
                    setIsManager(true);
                }
            });

            const sortedTeams = response.sort((team1, team2) => {
                if (team1.team.isActive && !team2.team.isActive) {
                    return 1;
                }
                if (team1.team.isActive && team2.team.isActive) {
                    return 0;
                }
                return -1;
            });
            setTeams(sortedTeams);

            if (sortedTeams.length > 0) {
                if (sortedTeams[0].role.toLowerCase() === 'manager') {
                    handleSelectTeam(sortedTeams[0]);
                } else if (
                    !!sortedTeams[0].status &&
                    sortedTeams[0].status.toLowerCase() !== 'pending'
                ) {
                    handleSelectTeam(sortedTeams[0]);
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
    }, [handleSelectTeam, isMounted]);

    interface renderProps {
        item: IUserRoles;
    }

    const renderCategory = useCallback(
        ({ item }: renderProps) => {
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

            return (
                <TeamItemContainer
                    isPending={isPending || !item.team.isActive}
                    onPress={() => handleSelectTeam(item)}
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
        [handleSelectTeam]
    );

    const handleNavigateCreateTeam = useCallback(() => {
        navigate('CreateTeam');
    }, [navigate]);

    const handleSettings = useCallback(() => {
        navigate('Settings');
    }, [navigate]);

    useEffect(() => {
        loadData();

        return () => setIsMounted(false);
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Title>{strings.View_TeamList_PageTitle}</Title>

            <Content>
                {teams.length <= 0 && (
                    <EmptyText>{strings.View_TeamList_EmptyTeamList}</EmptyText>
                )}
                {teams.length > 0 && (
                    <ListTeamsTitle>
                        {strings.View_TeamList_ListTitle}
                    </ListTeamsTitle>
                )}

                <ListCategories
                    data={teams}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={renderCategory}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={loadData}
                        />
                    }
                />
            </Content>

            <Footer>
                {(!isManager || teams.length > 1) && (
                    <Button
                        text={strings.View_TeamList_Button_CreateTeam}
                        onPress={handleNavigateCreateTeam}
                        contentStyle={{ width: 150, marginBottom: 0 }}
                    />
                )}

                <Button
                    text={strings.View_TeamList_Button_Settings}
                    onPress={handleSettings}
                    contentStyle={{ width: 150 }}
                />
            </Footer>
        </Container>
    );
};

export default memo(List);
