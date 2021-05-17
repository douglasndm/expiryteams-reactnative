import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { logoutFirebase } from '~/Functions/Auth/Firebase';
import { getUserTeams } from '~/Functions/Team/Users';
import { setSelectedTeam } from '~/Functions/Team/SelectedTeam';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    Title,
    ListCategories,
    TeamItemContainer,
    TeamItemTitle,
    TeamItemRole,
} from './styles';

const List: React.FC = () => {
    const { reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [teams, setTeams] = useState<Array<IUserRoles>>([]);

    const loadData = useCallback(async () => {
        try {
            const response = await getUserTeams();

            if ('error' in response) {
                if (response.status === 401 || response.status === 403) {
                    await logoutFirebase();
                    reset({
                        routes: [{ name: 'Login' }],
                    });
                }
                return;
            }

            setTeams(response);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });

            if (String(err.message).includes('Network Error')) {
                await logoutFirebase();
                reset({
                    routes: [{ name: 'Login' }],
                });
            }
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

            reset({
                routes: [{ name: 'Home' }],
            });
        },
        [teams, setUserPreferences, reset, userPreferences]
    );

    interface renderProps {
        item: IUserRoles;
    }

    const renderCategory = useCallback(
        ({ item }: renderProps) => {
            const teamToNavigate = item.team.id;

            return (
                <TeamItemContainer
                    onPress={() => handleSetTeam(teamToNavigate)}
                >
                    <TeamItemTitle>{item.team.name}</TeamItemTitle>
                    <TeamItemRole>{item.role}</TeamItemRole>
                </TeamItemContainer>
            );
        },
        [handleSetTeam]
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container>
            <Title>{translate('View_TeamList_PageTitle')}</Title>
            <ListCategories
                data={teams}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderCategory}
            />
        </Container>
    );
};

export default List;
