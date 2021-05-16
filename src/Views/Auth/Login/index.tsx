import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import api from '~/Services/API';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getUserSession, saveUserSession } from '~/Functions/Auth/Login';

import Button from '~/Components/Button';

import {
    Container,
    FormTitle,
    LoginForm,
    InputContainer,
    InputText,
} from './styles';

const Login: React.FC = () => {
    const { reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleNavigateUser = useCallback(
        (sesion: ISessionResponse) => {
            setUserPreferences({
                ...userPreferences,
                user: sesion.user,
            });

            reset({
                routes: [{ name: 'TeamList' }],
            });
        },
        [reset, userPreferences, setUserPreferences]
    );

    const checkUserAlreadySigned = useCallback(async () => {
        const session = await getUserSession();

        if (session) {
            handleNavigateUser(session);
        }
    }, [handleNavigateUser]);

    const handleLogin = useCallback(async () => {
        if (email.trim() === '' || password.trim() === '') {
            return;
        }

        try {
            const response = await api.post<ISessionResponse>('/sessions', {
                email,
                password,
            });

            await saveUserSession(response.data);
            handleNavigateUser(response.data);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [email, password, handleNavigateUser]);

    const handleEmailChange = useCallback(
        (value: string) => setEmail(value),
        []
    );

    const handleEmailPassword = useCallback(
        (value: string) => setPassword(value),
        []
    );

    useEffect(() => {
        checkUserAlreadySigned();
    }, [checkUserAlreadySigned]);

    return (
        <Container>
            <FormTitle>Entrar na sua conta</FormTitle>
            <LoginForm>
                <InputContainer>
                    <InputText
                        placeholder="E-mail"
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={email}
                        onChangeText={handleEmailChange}
                    />
                </InputContainer>

                <InputContainer>
                    <InputText
                        placeholder="Senha"
                        secureTextEntry
                        value={password}
                        onChangeText={handleEmailPassword}
                    />
                </InputContainer>
            </LoginForm>

            <Button text="Entrar" onPress={handleLogin} />
        </Container>
    );
};

export default Login;
