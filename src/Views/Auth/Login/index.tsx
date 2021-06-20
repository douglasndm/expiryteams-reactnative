import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';

import { loginFirebase } from '~/Functions/Auth/Firebase';
import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';

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
    InputContainer,
    InputText,
    ForgotPasswordText,
    Icon,
} from './styles';

const Login: React.FC = () => {
    const { reset, navigate } = useNavigation();
    const { signed, user, initializing } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [hidePass, setHidePass] = useState<boolean>(true);
    const [isLoging, setIsLoging] = useState<boolean>(false);

    const handleNavigateUser = useCallback(() => {
        reset({
            routes: [
                {
                    name: 'Routes',
                    state: {
                        routes: [{ name: 'TeamList' }],
                    },
                },
            ],
        });
    }, [reset]);

    const handleLogin = useCallback(async () => {
        const schema = Yup.object().shape({
            email: Yup.string().required().email(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid({ email, password }))) {
            showMessage({
                message: strings.View_Login_InputText_EmptyText,
                type: 'warning',
            });
            return;
        }

        try {
            setIsLoging(true);

            // Makes login with Firebase after that the subscriber event will handle
            await loginFirebase({
                email,
                password,
            });

            await clearSelectedteam();
        } catch (err) {
            setIsLoging(false);
            if (
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/user-not-found'
            ) {
                showMessage({
                    message: strings.View_Login_Error_WrongEmailOrPassword,
                    type: 'danger',
                });
                return;
            }
            if (err.code === 'auth/network-request-failed') {
                showMessage({
                    message: strings.View_Login_Error_NetworkError,
                    type: 'danger',
                });
                return;
            }
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [email, password]);

    const handleEmailChange = useCallback(
        (value: string) => setEmail(value),
        []
    );

    const handleEmailPassword = useCallback(
        (value: string) => setPassword(value),
        []
    );

    const handleShowPass = useCallback(() => {
        setHidePass(!hidePass);
    }, [hidePass]);

    const handleNavigateToForgotPass = useCallback(() => {
        navigate('ForgotPassword');
    }, [navigate]);

    useEffect(() => {
        if (signed && user) {
            if (user.emailVerified) {
                handleNavigateUser();
            } else {
                navigate('VerifyEmail');
            }
        }
    }, [handleNavigateUser, navigate, signed, user]);

    return (
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
                        <InputContainer>
                            <InputText
                                placeholder={
                                    strings.View_Login_InputText_Email_Placeholder
                                }
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={email}
                                onChangeText={handleEmailChange}
                            />
                        </InputContainer>

                        <InputContainer>
                            <InputText
                                placeholder={
                                    strings.View_Login_InputText_Password_Placeholder
                                }
                                secureTextEntry={hidePass}
                                value={password}
                                onChangeText={handleEmailPassword}
                            />
                            <Icon
                                name={
                                    hidePass ? 'eye-outline' : 'eye-off-outline'
                                }
                                onPress={handleShowPass}
                            />
                        </InputContainer>

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
