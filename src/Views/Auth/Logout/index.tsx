import React, { useCallback, useContext, useEffect } from 'react';

import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

import Loading from '~/Components/Loading';

const Logout: React.FC = () => {
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
        } catch (err) {
            showMessage({
                message: err.message,
            });
        }
    }, [setPreferences, preferences]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);
    return <Loading />;
};

export default Logout;
