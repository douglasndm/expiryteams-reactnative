import React, { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

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
    return <View />;
};

export default Logout;
