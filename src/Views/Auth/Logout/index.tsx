import React, { useCallback, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';

import { clearSelectedteam } from '@utils/Team/SelectedTeam';
import { logoutFirebase } from '@utils/Auth/Firebase';

import { useTeam } from '~/Contexts/TeamContext';

import { reset } from '~/References/Navigation';

import Loading from '~/Components/Loading';

const Logout: React.FC = () => {
    const teamContext = useTeam();

    const handleLogout = useCallback(async () => {
        try {
            await logoutFirebase();
            await clearSelectedteam();

            if (teamContext.reload) {
                teamContext.reload();
            }

            reset({
                routeHandler: 'Auth',
                routesNames: ['Login'],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [teamContext]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);
    return <Loading />;
};

export default Logout;
