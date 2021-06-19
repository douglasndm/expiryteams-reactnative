import React, { useCallback, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

import Loading from '~/Components/Loading';

const Logout: React.FC = () => {
    const { reset } = useNavigation();

    const { preferences, setPreferences } = useContext(PreferencesContext);

    const handleLogout = useCallback(async () => {
        try {
            await logoutFirebase();
            await clearSelectedteam();

            setPreferences({
                ...preferences,
                selectedTeam: null,
            });

            reset({
                routes: [{ name: 'Login' }],
            });
        } catch (err) {
            showMessage({
                message: err.message,
            });
        }
    }, [setPreferences, preferences, reset]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);
    return <Loading />;
};

export default Logout;
