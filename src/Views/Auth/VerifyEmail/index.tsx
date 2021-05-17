import React, { useCallback, useMemo, useState } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { isEmailConfirmed } from '~/Functions/Auth/Account';

import Button from '~/Components/Button';

import {
    Container,
    Content,
    WaitingConfirmationEmail,
    EmailConfirmationExplain,
} from './styles';

const VerifyEmail: React.FC = () => {
    const { navigate, reset } = useNavigation();

    const [isCheckLoading, setIsCheckLoading] = useState<boolean>(false);

    const animation = useMemo(() => {
        return require('~/Assets/Animations/email-animation.json');
    }, []);

    const handleCheckEmail = useCallback(async () => {
        try {
            setIsCheckLoading(true);
            const confirmed = await isEmailConfirmed();

            if (confirmed) {
                reset({ routes: [{ name: 'TeamList' }] });
            } else {
                showMessage({
                    message: translate(
                        'View_ConfirmEmail_Error_EmailNotConfirmed'
                    ),
                    type: 'danger',
                });
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsCheckLoading(false);
        }
    }, [reset]);

    const handleLogout = useCallback(() => {
        navigate('Logout');
    }, [navigate]);

    return (
        <Container>
            <Content>
                <LottieView
                    source={animation}
                    autoPlay
                    loop
                    style={{ width: 180, height: 180 }}
                />

                <WaitingConfirmationEmail>
                    {translate('View_ConfirmEmail_WaitingTitle')}
                </WaitingConfirmationEmail>

                <EmailConfirmationExplain>
                    {translate('View_ConfirmEmail_WaitingDescription')}
                </EmailConfirmationExplain>

                <Button
                    text={translate('View_ConfirmEmail_Button_Confirmed')}
                    isLoading={isCheckLoading}
                    onPress={handleCheckEmail}
                    contentStyle={{ width: 150 }}
                />

                <Button
                    text={translate('View_ConfirmEmail_Button_Logout')}
                    onPress={handleLogout}
                    contentStyle={{ width: 150, marginTop: 0 }}
                />
            </Content>
        </Container>
    );
};

export default VerifyEmail;
