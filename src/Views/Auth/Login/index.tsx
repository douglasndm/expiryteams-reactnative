import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { loginFirebase } from '~/Functions/Auth/Firebase';
import { createUser, getUser } from '~/Functions/User';

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
    Text,
    ForgotPasswordText,
    CreateAccountText,
    AboutContainer,
    Link,
    Icon,
} from './styles';

const Login: React.FC = () => {
    const { reset, navigate } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [hidePass, setHidePass] = useState<boolean>(true);
    const [isLoging, setIsLoging] = useState<boolean>(false);

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
        const schema = Yup.object().shape({
            email: Yup.string().required().email(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid({ email, password }))) {
            showMessage({
                message: translate('View_Login_InputText_EmptyText'),
                type: 'warning',
            });
            return;
        }

        try {
            setIsLoging(true);
            const response = await loginFirebase({
                email,
                password,
            });

            try {
                await getUser();
            } catch (err) {
                if (String(err.message).includes('User was not found')) {
                    await createUser({
                        email,
                    });
                }
            }

            if (response.emailVerified) {
                handleNavigateUser(response);
            } else {
                navigate('VerifyEmail');
            }
        } catch (err) {
            if (
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/user-not-found'
            ) {
                showMessage({
                    message: translate('View_Login_Error_WrongEmailOrPassword'),
                    type: 'danger',
                });
                return;
            }
            if (err.code === 'auth/network-request-failed') {
                showMessage({
                    message: translate('View_Login_Error_NetworkError'),
                    type: 'danger',
                });
                return;
            }
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoging(false);
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

    const handleShowPass = useCallback(() => {
        setHidePass(!hidePass);
    }, [hidePass]);

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
                            {translate('View_Login_Label_ForgotPassword')}
                        </ForgotPasswordText>
                    </LoginForm>

                    <Button
                        text={translate('View_Login_Button_SignIn')}
                        onPress={handleLogin}
                        isLoading={isLoging}
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
