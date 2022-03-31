import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';

import {
    isEmailConfirmed,
    resendConfirmationEmail,
} from '~/Functions/Auth/Account';

import Button from '~/Components/Button';

import {
    Container,
    Content,
    WaitingConfirmationEmail,
    EmailConfirmationExplain,
    ResendEmailText,
} from './styles';

const VerifyEmail: React.FC = () => {
    const { navigate, reset } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();

    const { user } = useAuth();

    const [isMounted, setIsMounted] = useState<boolean>(true);
    const [isCheckLoading, setIsCheckLoading] = useState<boolean>(false);
    const [resendedEmail, setResendedEmail] = useState<boolean>(false);

    const animation = useMemo(() => {
        return require('~/Assets/Animations/email-animation.json');
    }, []);

    const handleCheckEmail = useCallback(async () => {
        if (!isMounted) return;
        try {
            setIsCheckLoading(true);
            const confirmed = await isEmailConfirmed();

            if (confirmed) {
                reset({ routes: [{ name: 'TeamList' }] });
            } else {
                showMessage({
                    message: strings.View_ConfirmEmail_Error_EmailNotConfirmed,
                    type: 'danger',
                });
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsCheckLoading(false);
        }
    }, [isMounted, reset]);

    const handleLogout = useCallback(() => {
        navigate('Logout');
    }, [navigate]);

    const handleResendConfirmEmail = useCallback(async () => {
        try {
            setResendedEmail(true);
            await resendConfirmationEmail();
            showMessage({
                message: strings.View_ConfirmEmail_Alert_Success,
                type: 'info',
            });
        } catch (err) {
            if (err.code !== 'auth/too-many-requests') {
                setResendedEmail(false);
            }
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, []);

    useEffect(() => {
        return () => {
            setIsMounted(false);
        };
    });

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
                    {strings.View_ConfirmEmail_WaitingTitle}
                </WaitingConfirmationEmail>

                {!!user && user.email && (
                    <EmailConfirmationExplain>
                        {strings.View_ConfirmEmail_WaitingDescription.replace(
                            '#{EMAIL}',
                            user.email
                        )}
                    </EmailConfirmationExplain>
                )}

                <Button
                    text={strings.View_ConfirmEmail_Button_Confirmed}
                    isLoading={isCheckLoading}
                    onPress={handleCheckEmail}
                    contentStyle={{ width: 150 }}
                />

                <Button
                    text={strings.View_ConfirmEmail_Button_Logout}
                    onPress={handleLogout}
                    contentStyle={{ width: 150, marginTop: 0 }}
                />

                {!resendedEmail && (
                    <ResendEmailText onPress={handleResendConfirmEmail}>
                        {strings.View_ConfirmEmail_ResendEmail}
                    </ResendEmailText>
                )}
            </Content>
        </Container>
    );
};

export default VerifyEmail;
