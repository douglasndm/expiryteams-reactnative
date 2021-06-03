import React, { useCallback, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

import Loading from '~/Components/Loading';

const Logout: React.FC = () => {
    const { goBack, reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const handleLogout = useCallback(async () => {
        try {
            await logoutFirebase();
            await clearSelectedteam();

            setUserPreferences({
                ...userPreferences,
                user: null,
                selectedTeam: null,
            });
            try {
                reset({ routes: [{ name: 'Login' }] });
            } catch (err) {}
        } catch (err) {
            showMessage({
                message: err.message,
            });
        }
    }, [reset, setUserPreferences, userPreferences]);

    useEffect(() => {
        handleLogout();
    }, []);
    return <Loading />;
};

export default Logout;
