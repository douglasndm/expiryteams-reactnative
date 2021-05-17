import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Linking, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { loginFirebase } from '~/Functions/Auth/Firebase';

import Button from '~/Components/Button';

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
    CreateAccountText,
    AboutContainer,
    Link,
} from './styles';

const Login: React.FC = () => {
    const { reset, navigate } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleNavigateUser = useCallback(
        (session: FirebaseAuthTypes.User) => {
            setUserPreferences({
                ...userPreferences,
                user: session,
            });

            reset({
                routes: [{ name: 'TeamList' }],
            });
        },
        [reset, userPreferences, setUserPreferences]
    );

    const checkUserAlreadySigned = useCallback(async () => {
        const session = auth().currentUser;

        if (session) {
            if (session.emailVerified) {
                handleNavigateUser(session);
                return;
            }
            reset({
                routes: [{ name: 'VerifyEmail' }],
            });
        }
    }, [handleNavigateUser, reset]);

    const handleLogin = useCallback(async () => {
        if (email.trim() === '' || password.trim() === '') {
            showMessage({
                message: translate('View_Login_InputText_EmptyText'),
                type: 'warning',
            });
            return;
        }

        try {
            const response = await loginFirebase({
                email,
                password,
            });

            if (response.emailVerified) {
                handleNavigateUser(response);
            } else {
                navigate('VerifyEmail');
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [email, password, handleNavigateUser, navigate]);

    const handleEmailChange = useCallback(
        (value: string) => setEmail(value),
        []
    );

    const handleEmailPassword = useCallback(
        (value: string) => setPassword(value),
        []
    );

    const handleNavigateToForgotPass = useCallback(() => {
        navigate('ForgotPassword');
    }, [navigate]);

    const handleNavigateToCreateAcc = useCallback(() => {
        navigate('CreateAccount');
    }, [navigate]);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    useEffect(() => {
        checkUserAlreadySigned();
    }, [checkUserAlreadySigned]);

    return (
        <Container>
            <Content>
                <LogoContainer>
                    <Logo />
                    <LogoTitle>
                        {translate('View_Login_Business_Title').toUpperCase()}
                    </LogoTitle>
                </LogoContainer>

                <FormContainer>
                    <FormTitle>
                        {translate('View_Login_FormLogin_Title')}
                    </FormTitle>
                    <LoginForm>
                        <InputContainer>
                            <InputText
                                placeholder={translate(
                                    'View_Login_InputText_Email_Placeholder'
                                )}
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={email}
                                onChangeText={handleEmailChange}
                            />
                        </InputContainer>

                        <InputContainer>
                            <InputText
                                placeholder={translate(
                                    'View_Login_InputText_Password_Placeholder'
                                )}
                                secureTextEntry
                                value={password}
                                onChangeText={handleEmailPassword}
                            />
                        </InputContainer>

                        <ForgotPasswordText
                            onPress={handleNavigateToForgotPass}
                        >
                            {translate('View_Login_Label_ForgotPassword')}
                        </ForgotPasswordText>
                    </LoginForm>

                    <Button
                        text={translate('View_Login_Button_SignIn')}
                        onPress={handleLogin}
                    />
                </FormContainer>
            </Content>

            <AboutContainer>
                <CreateAccountText onPress={handleNavigateToCreateAcc}>
                    {translate('View_Login_Label_CreateAccount')}
                </CreateAccountText>

                <Text>
                    {translate('BeforeTermsAndPrivacy')}
                    <Link onPress={navigateToTerms}>{translate('Terms')}</Link>
                    {translate('BetweenTermsAndPrivacy')}
                    <Link onPress={navigateToPrivacy}>
                        {translate('PrivacyPolicy')}
                    </Link>
                    .
                </Text>
            </AboutContainer>
        </Container>
    );
};

export default Login;
