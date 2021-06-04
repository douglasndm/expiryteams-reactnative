import React, { useCallback, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

import Loading from '~/Components/Loading';

const Logout: React.FC = () => {
    const { goBack, reset } = useNavigation();

    const { preferences, setPreferences } = useContext(PreferencesContext);

    const handleLogout = useCallback(async () => {
        try {
            await logoutFirebase();
            await clearSelectedteam();

            setPreferences({
                ...preferences,
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
    }, [reset, setPreferences, preferences]);

    useEffect(() => {
        handleLogout();
    }, []);
    return <Loading />;
};

export default Logout;
