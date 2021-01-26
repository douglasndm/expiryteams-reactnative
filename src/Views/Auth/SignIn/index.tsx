import React, { useCallback, useState, useContext } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appleAuth } from 'AppleAuth';

import { translate } from '~/Locales';

import { setUserId } from '~/Functions/User';
import { signIn } from '~/Functions/Auth';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Header from '~/Components/Header';
import GenericButton from '~/Components/Button';

import {
    Container,
    TextsContainer,
    FirstText,
    SecondText,
    ThirdText,
    LoginText,
    ButtonContainer,
    AppleButton,
    GoogleButton,
    ErrorMessage,
} from './styles';

const SignIn: React.FC = () => {
    const [completed, setCompleted] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const handleLoginWithApple = useCallback(async () => {
        try {
            setCompleted(false);
            const user = await signIn('Apple');

            await setUserId(user.uid);

            setUserPreferences({
                ...userPreferences,
                isUserSignedIn: true,
            });

            setCompleted(true);
        } catch (err) {
            setError(err.message);
        }
    }, [userPreferences, setUserPreferences]);

    const handleGoogleButtonPressed = useCallback(async () => {
        try {
            setCompleted(false);

            const user = await signIn('Google');

            await setUserId(user.uid);

            setUserPreferences({
                ...userPreferences,
                isUserSignedIn: true,
            });

            setCompleted(true);
        } catch (err) {
            setError(err.message);
        }
    }, [userPreferences, setUserPreferences]);

    const handleToGoProPage = useCallback(() => {
        reset({
            routes: [{ name: 'Home' }, { name: 'Pro' }],
        });
    }, [reset]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return (
        <Container>
            <Header title={translate('View_Auth_SignIn_PageTitle')} />
            <TextsContainer>
                <FirstText>
                    {translate('View_Auth_SignIn_Text_LoginRequired')}
                </FirstText>

                <SecondText>
                    {translate('View_Auth_SignIn_Text_WhyLogin')}
                </SecondText>

                <ThirdText>
                    {translate('View_Auth_SignIn_Text_Benefits')}
                </ThirdText>
            </TextsContainer>

            <LoginText>
                {completed
                    ? translate('View_Auth_SignIn_Text_AllDone')
                    : translate('View_Auth_SignIn_Text_Login')}
            </LoginText>

            <ButtonContainer>
                {Platform.OS === 'ios' &&
                    appleAuth.isSupported &&
                    !completed && (
                        <AppleButton
                            buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                            onPress={handleLoginWithApple}
                        />
                    )}

                {Platform.OS === 'android' && !completed && (
                    <GoogleButton onPress={handleGoogleButtonPressed} />
                )}

                {completed && (
                    <GenericButton
                        text={translate(
                            'View_Auth_SignIn_Button_ContinueToSubscription'
                        )}
                        onPress={handleToGoProPage}
                    />
                )}
            </ButtonContainer>

            {!!error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
    );
};
export default SignIn;
