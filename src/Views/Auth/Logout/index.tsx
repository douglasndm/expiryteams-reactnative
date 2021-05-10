import React, { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Container } from './styles';

import { clearUserSession } from '~/Functions/Auth/Login';
import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';

const Logout: React.FC = () => {
    const { reset } = useNavigation();

    const handleLogout = useCallback(async () => {
        await clearUserSession();
        await clearSelectedteam();

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
