import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTeam } from '~/Contexts/TeamContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';

import Button from '~/Components/Button';

import { Category, CategoryOptions, CategoryTitle } from '../../styles';

const Account: React.FC = () => {
    const { navigate, reset } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();

    const teamContext = useTeam();

    const handleLogout = useCallback(() => {
        navigate('Logout');
    }, [navigate]);

    const handleNavigateDelete = useCallback(() => {
        navigate('DeleteUser');
    }, [navigate]);

    const navigateToTeamList = useCallback(async () => {
        if (teamContext.clearTeam) {
            await clearSelectedteam();
            teamContext.clearTeam();
            reset({
                routes: [{ name: 'TeamList' }],
            });
        }
    }, [reset, teamContext]);

    return (
        <Category>
            <CategoryTitle>Conta</CategoryTitle>

            <CategoryOptions>
                <Button
                    text="Times"
                    onPress={navigateToTeamList}
                    contentStyle={{ width: 135 }}
                />

                <Button
                    text="Sair"
                    onPress={handleLogout}
                    contentStyle={{ width: 135 }}
                />

                <Button
                    text="Apagar conta"
                    onPress={handleNavigateDelete}
                    contentStyle={{
                        width: 135,
                        marginTop: 0,
                        backgroundColor: '#b00c17',
                    }}
                />
            </CategoryOptions>
        </Category>
    );
};

export default Account;
