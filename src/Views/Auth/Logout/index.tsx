import React, { useCallback, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

import Loading from '~/Components/Loading';

import { Container } from './styles';

const Logout: React.FC = () => {
    const { goBack, reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    useEffect(() => {
        logoutFirebase().then(() => {
            clearSelectedteam().then(() => {
                setUserPreferences({
                    ...userPreferences,
                    user: null,
                    selectedTeam: null,
                });

                try {
                    reset({ routes: [{ name: 'Login' }] });
                } catch (err) {}
            });
        });
    }, [reset]);
    return <Loading />;
};

export default Logout;
