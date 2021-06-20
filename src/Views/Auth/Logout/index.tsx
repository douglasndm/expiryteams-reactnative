import React, { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '~/Contexts/TeamContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

import Loading from '~/Components/Loading';

const Logout: React.FC = () => {
    const { reset } = useNavigation();

    const teamContext = useTeam();

    const handleLogout = useCallback(async () => {
        try {
            await logoutFirebase();
            await clearSelectedteam();

            if (teamContext.reload) {
                teamContext.reload();
            }

            reset({
                routes: [{ name: 'Login' }],
            });
        } catch (err) {
            showMessage({
                message: err.message,
            });
        }
    }, [teamContext, reset]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);
    return <Loading />;
};

export default Logout;
