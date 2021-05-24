import React, { useCallback, useContext, useEffect } from 'react';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

import { Container } from './styles';

const Logout: React.FC = () => {
    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const handleLogout = useCallback(async () => {
        await clearSelectedteam();

        await logoutFirebase();

        setUserPreferences({
            ...userPreferences,
            user: null,
            selectedTeam: null,
        });
    }, [setUserPreferences, userPreferences]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);
    return <Container />;
};

export default Logout;
