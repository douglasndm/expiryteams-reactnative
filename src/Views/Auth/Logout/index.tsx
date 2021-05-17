import React, { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Container } from './styles';

import { clearUserSession } from '~/Functions/Auth/Login';
import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

const Logout: React.FC = () => {
    const { reset } = useNavigation();

    const handleLogout = useCallback(async () => {
        await clearUserSession();
        await clearSelectedteam();

        await logoutFirebase();

        reset({
            routes: [{ name: 'Login' }],
        });
    }, [reset]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);
    return <Container />;
};

export default Logout;
