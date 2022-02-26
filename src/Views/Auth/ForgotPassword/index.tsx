import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { recoveryPassword } from '~/Functions/Auth/Firebase/password';

import Header from '~/Components/Header';
import Input from '~/Components/InputText';
import Button from '~/Components/Button';

import { Container, Content } from './styles';

const ForgotPassword: React.FC = () => {
    const { goBack } = useNavigation();

    const [isRecovering, setIsRecovering] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');

    const handleEmailChange = useCallback(
        (value: string) => setEmail(value.trim()),
        []
    );

    const handleRecoveryPassword = useCallback(async () => {
        const schema = Yup.object().shape({
            email: Yup.string().required().email(),
        });

        try {
            setIsRecovering(true);
            await schema.validate({ email });

            await recoveryPassword({ email });

            showMessage({
                message:
                    'Um e-mail foi enviado com um link para recuperar sua senha',
                type: 'info',
            });

            goBack();
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsRecovering(false);
        }
    }, [email, goBack]);
    return (
        <Container>
            <Header title="Recuperar senha" noDrawer />

            <Content>
                <Input
                    placeholder={strings.View_Login_InputText_Email_Placeholder}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={email}
                    onChange={handleEmailChange}
                />
                <Button
                    text="Recuperar"
                    onPress={handleRecoveryPassword}
                    isLoading={isRecovering}
                />
            </Content>
        </Container>
    );
};

export default ForgotPassword;
