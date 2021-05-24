import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getUserTeams } from '~/Functions/Team/Users';
import { setSelectedTeam } from '~/Functions/Team/SelectedTeam';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Button from '~/Components/Button';

import {
    Container,
    Title,
    ListTeamsTitle,
    ListCategories,
    TeamItemContainer,
    TeamItemTitle,
    TeamItemRole,
} from './styles';

const List: React.FC = () => {
    const { navigate, reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [teams, setTeams] = useState<Array<IUserRoles>>([]);
    const [inactiveTeams, setInactiveTeams] = useState<Array<IUserRoles>>([]);

    const loadData = useCallback(async () => {
        try {
            const response = await getUserTeams();

            if ('error' in response) {
                if (response.status === 401 || response.status === 403) {
                    reset({
                        routes: [{ name: 'Logout' }],
                    });
                }
                return;
            }

            const active = response.filter(item => item.team.active === true);
            const inactive = response.filter(item => item.team.active !== true);

            setTeams(active);
            setInactiveTeams(inactive);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [reset]);

    const handleSetTeam = useCallback(
        async (teamId: string) => {
            const selectedTeam = teams.find(t => t.team.id === teamId);

            if (!selectedTeam) {
                throw new Error('Team not found');
            }

            await setSelectedTeam(selectedTeam);
            setUserPreferences({
                ...userPreferences,
                selectedTeam,
            });
        },
        [teams, setUserPreferences, userPreferences]
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

            function handleNavigate() {
                if (item.team.active !== true) {
                    if (item.role.toLowerCase() !== 'manager') {
                        showMessage({
                            message: 'O gerente precisa ativar o time.',
                            type: 'danger',
                        });
                    }
                    // time não ativo
                } else if (isPending) {
                    handleNavigateToEnterCode(item);
                } else {
                    handleSetTeam(teamToNavigate);
                }
            }

            return (
                <>
                    <TeamItemContainer
                        isPending={isPending}
                        onPress={handleNavigate}
                    >
                        <TeamItemTitle>{item.team.name}</TeamItemTitle>
                        <TeamItemRole>
                            {item.status === 'Pending'
                                ? item.status.toUpperCase()
                                : item.role.toUpperCase()}
                        </TeamItemRole>
                    </TeamItemContainer>
                </>
            );
        },
        [handleNavigateToEnterCode, handleSetTeam]
    );

    const handleNavigateCreateTeam = useCallback(() => {
        navigate('CreateTeam');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container>
            <Title>{translate('View_TeamList_PageTitle')}</Title>

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

            <Button
                text={translate('View_TeamList_Button_CreateTeam')}
                onPress={handleNavigateCreateTeam}
            />
        </Container>
    );
};

export default List;
