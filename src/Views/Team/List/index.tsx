import React, {
    useState,
    useCallback,
    useEffect,
    useContext,
    useRef,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getUserTeams } from '~/Functions/Team/Users';
import { setSelectedTeam } from '~/Functions/Team/SelectedTeam';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Button from '~/Components/Button';
import Loading from '~/Components/Loading';

import {
    Container,
    Title,
    Content,
    ListTeamsTitle,
    ListCategories,
    TeamItemContainer,
    TeamItemTitle,
    TeamItemRole,
    Footer,
} from './styles';

const List: React.FC = () => {
    const { navigate, reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const mounted = useRef(false);

    const [isLoading, setIsLoading] = useState(true);

    const [teams, setTeams] = useState<Array<IUserRoles>>([]);
    const [inactiveTeams, setInactiveTeams] = useState<Array<IUserRoles>>([]);

    // This is for check if user is already manager on any team
    // If so, disable creating of new team
    // This is due limition of identify user and teams on revenuecat
    const [isManager, setIsManager] = useState<boolean>(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    });

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getUserTeams();

            if ('error' in response) {
                if (response.status === 401 || response.status === 403) {
                    reset({
                        routes: [{ name: 'Logout' }],
                    });
                }
                return;
            }

            if (mounted) {
                response.forEach(item => {
                    if (item.role.toLowerCase() === 'Manager'.toLowerCase()) {
                        setIsManager(true);
                    }
                });

                const active = response.filter(
                    item => item.team.active === true
                );
                const inactive = response.filter(
                    item => item.team.active !== true
                );

                setTeams(active);
                setInactiveTeams(inactive);
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [reset]);

    const handleSetTeam = useCallback(
        async (teamId: string) => {
            let selectedTeam = teams.find(t => t.team.id === teamId);

            if (!selectedTeam) {
                selectedTeam = inactiveTeams.find(t => t.team.id === teamId);
            }

            if (!selectedTeam) {
                throw new Error('Team not found');
            }

            await setSelectedTeam(selectedTeam);
            setUserPreferences({
                ...userPreferences,
                selectedTeam,
            });

            if (!!userPreferences.user && userPreferences.selectedTeam) {
                reset({
                    routes: [{ name: 'Home' }],
                });
            }
        },
        [teams, setUserPreferences, userPreferences, inactiveTeams, reset]
    );

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

            let isPending = true;

            if (item.status) {
                if (item.status.trim().toLowerCase() === 'completed') {
                    isPending = false;
                }
            }

            let role = '';

            if (item.role.toLowerCase() === 'manager')
                role = translate('UserInfo_Role_Manager');
            if (item.role.toLowerCase() === 'supervisor') {
                role = translate('UserInfo_Role_Supervisor');
            }
            if (item.role.toLowerCase() === 'repositor') {
                role = translate('UserInfo_Role_Repositor');
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
                    isPending={isPending}
                    onPress={handleNavigate}
                >
                    <TeamItemTitle>{item.team.name}</TeamItemTitle>
                    <TeamItemRole>
                        {item.status === 'Pending'
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

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Title>{translate('View_TeamList_PageTitle')}</Title>

            <Content>
                {teams.length > 0 && (
                    <>
                        <ListTeamsTitle>Times</ListTeamsTitle>
                        <ListCategories
                            data={teams}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={renderCategory}
                        />
                    </>
                )}

                {inactiveTeams.length > 0 && (
                    <>
                        <ListTeamsTitle>Times inativos</ListTeamsTitle>
                        <ListCategories
                            data={inactiveTeams}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={renderCategory}
                        />
                    </>
                )}
            </Content>

            <Footer>
                {!isManager && (
                    <Button
                        text={translate('View_TeamList_Button_CreateTeam')}
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
