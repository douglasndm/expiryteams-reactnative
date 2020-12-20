import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../../Locales';

import { setUserId } from '../../../Functions/User';
import { signInWithGoogle } from '../../../Functions/Auth/Google';

import Header from '../../../Components/Header';
import GenericButton from '../../../Components/Button';
import Notification from '../../../Components/Notification';

import {
    Container,
    TextsContainer,
    FirstText,
    SecondText,
    ThirdText,
    LoginText,
    GoogleButton,
} from './styles';

const SignIn: React.FC = () => {
    const [completed, setCompleted] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { navigate } = useNavigation();

    const handleGoogleButtonPressed = useCallback(async () => {
        try {
            setCompleted(false);

            const user = await signInWithGoogle();

            await setUserId(user.uid);

            setCompleted(true);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    const handleToGoProPage = useCallback(() => {
        navigate('PremiumSubscription');
    }, [navigate]);

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
            {!completed && <GoogleButton onPress={handleGoogleButtonPressed} />}

            {completed && (
                <GenericButton
                    text={translate(
                        'View_Auth_SignIn_Button_ContinueToSubscription'
                    )}
                    onPress={handleToGoProPage}
                />
            )}

            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </Container>
    );
};

export default SignIn;
