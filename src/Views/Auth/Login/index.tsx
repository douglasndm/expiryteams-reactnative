import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';

import { login } from '~/Functions/Auth';

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
    const { navigate, reset } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();
    const { initializing } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoging, setIsLoging] = useState<boolean>(false);

    const [isMounted, setIsMounted] = useState(true);

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
            return;
        }

        try {
            setIsLoging(true);

            // Makes login with Firebase after that the subscriber event will handle
            const user = await login({ email, password });

            if (user && !user.emailVerified) {
                reset({
                    routes: [
                        {
                            name: 'Routes',
                            state: {
                                routes: [
                                    {
                                        name: 'VerifyEmail',
                                    },
                                ],
                            },
                        },
                    ],
                });

                return;
            }
            if (user) {
                reset({
                    routes: [
                        {
                            name: 'Routes',
                            state: {
                                routes: [
                                    {
                                        name: 'TeamList',
                                    },
                                ],
                            },
                        },
                    ],
                });
            }
        } catch (err) {
            if (err instanceof Error) {
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
            }
        } finally {
            setIsLoging(false);
        }
    }, [email, password, reset]);

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
        try {
            setIsLoading(true);

            const user = auth().currentUser;

            if (user) {
                if (!user.emailVerified) {
                    navigate('Routes', {
                        state: {
                            routes: [{ name: 'VerifyEmail' }],
                        },
                    });
                    return;
                }
                reset({
                    routes: [
                        {
                            name: 'Routes',
                            state: {
                                routes: [
                                    {
                                        name: 'TeamList',
                                    },
                                ],
                            },
                        },
                    ],
                });
            }
        } finally {
            setIsLoading(false);
        }

        return () => setIsMounted(false);
    }, [isMounted, navigate, reset]);

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
                            contentStyle={{ marginBottom: 10 }}
                        />

                        <Input
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder={
                                strings.View_Login_InputText_Password_Placeholder
                            }
                            autoCorrect={false}
                            autoCapitalize="none"
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
