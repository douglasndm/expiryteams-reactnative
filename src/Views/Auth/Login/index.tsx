import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import api from '~/Services/API';

import { saveUserSession } from '~/Functions/Auth/Login';

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

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

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

            reset({
                routes: [{ name: 'Home' }],
            });
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }, [email, password, reset]);

    const handleEmailChange = useCallback(
        (value: string) => setEmail(value),
        []
    );

    const handleEmailPassword = useCallback(
        (value: string) => setPassword(value),
        []
    );

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
