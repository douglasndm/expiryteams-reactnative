import React, { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '~/Contexts/AuthContext';
import { useTeam } from '~/Contexts/TeamContext';

import { Container } from './styles';

const App: React.FC = () => {
    const { reset } = useNavigation();

    const { user } = useAuth();
    const teamContext = useTeam();

    const initApp = useCallback(async () => {
        if (!user?.emailVerified) {
            reset({
                routes: [
                    {
                        name: 'VerifyEmail',
                    },
                ],
            });
            return;
        }

        if (!teamContext.id) {
            reset({
                routes: [
                    {
                        name: 'TeamList',
                    },
                ],
            });
        }
    }, [reset, teamContext.id, user]);

    useEffect(() => {
        initApp();
    }, []);

    return <Container />;
};

export default App;
