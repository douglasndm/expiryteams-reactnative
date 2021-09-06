import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';

import { login } from '~/Functions/Auth';
import { getUserTeams } from '~/Functions/Team/Users';
import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

import { reset } from '~/References/Navigation';

import Loading from '~/Components/Loading';
import Input from '~/Components/InputText';
import Button from '~/Components/Button';

import Footer from './Footer';

import {
    Container,
    Content,
    LogoContainer,
    Logo,
    LogoTitle,
    FormContainer,
    FormTitle,
    LoginForm,
    ForgotPasswordText,
} from './styles';

const Login: React.FC = () => {
    const { navigate } = useNavigation();
    const { initializing } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoging, setIsLoging] = useState<boolean>(false);

    const handleSelectedTeam = useCallback(async () => {
        try {
            const user = auth().currentUser;

            if (user) {
                const userTeams = await getUserTeams();
                const currentSelectedTeam = await getSelectedTeam();

                const team = userTeams.find(
                    t => t.team.id === currentSelectedTeam?.team.id
                );

                if (team && team.team.active) {
                    reset({
                        routesNames: ['Home'],
                    });
                } else {
                    reset({
                        routesNames: ['TeamList'],
                    });
                }
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, []);

    const handleLogin = useCallback(async () => {
        const schema = Yup.object().shape({
            email: Yup.string().required().email(),
            password: Yup.string().required(),
        });

        try {
            await schema.validate({ email, password });
        } catch (err) {
            showMessage({
                message: strings.View_Login_InputText_EmptyText,
                type: 'warning',
            });
        }

        try {
            setIsLoging(true);

            // Makes login with Firebase after that the subscriber event will handle
            const user = await login({ email, password });

            if (user && !user.emailVerified) {
                reset({
                    routesNames: ['VerifyEmail'],
                });
                return;
            }

            await handleSelectedTeam();
        } catch (err) {
            let error = err.message;
            if (
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/user-not-found'
            ) {
                error = strings.View_Login_Error_WrongEmailOrPassword;
            } else if (err.code === 'auth/network-request-failed') {
                error = strings.View_Login_Error_NetworkError;
            } else if (error === 'request error') {
                error = 'Erro de conexão';
            }

            showMessage({
                message: error,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [email, handleSelectedTeam, password]);

    const handleEmailChange = useCallback(
        (value: string) => setEmail(value.trim()),
        []
    );

    const handlePasswordChange = useCallback(
        (value: string) => setPassword(value),
        []
    );

    const handleNavigateToForgotPass = useCallback(() => {
        navigate('ForgotPassword');
    }, [navigate]);

    useEffect(() => {
        if (auth().currentUser) {
            handleSelectedTeam()
                .then(() => setIsLoading(false))
                .catch(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Content>
                <LogoContainer>
                    <Logo />
                    <LogoTitle>
                        {strings.View_Login_Business_Title.toUpperCase()}
                    </LogoTitle>
                </LogoContainer>

                <FormContainer>
                    <FormTitle>{strings.View_Login_FormLogin_Title}</FormTitle>
                    <LoginForm>
                        <Input
                            value={email}
                            onChange={handleEmailChange}
                            placeholder={
                                strings.View_Login_InputText_Email_Placeholder
                            }
                            autoCorrect={false}
                            autoCapitalize="none"
                            contentStyle={{ marginBottom: 5 }}
                        />

                        <Input
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder={
                                strings.View_Login_InputText_Password_Placeholder
                            }
                            isPassword
                        />

                        <ForgotPasswordText
                            onPress={handleNavigateToForgotPass}
                        >
                            {strings.View_Login_Label_ForgotPassword}
                        </ForgotPasswordText>
                    </LoginForm>

                    <Button
                        text={strings.View_Login_Button_SignIn}
                        onPress={handleLogin}
                        isLoading={isLoging || initializing}
                    />
                </FormContainer>
            </Content>

            <Footer />
        </Container>
    );
};

export default Login;
