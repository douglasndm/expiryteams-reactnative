import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { recoveryPassword } from '~/Functions/Auth/Firebase/password';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';

import {
    FormContainer,
    LoginForm,
    InputText,
    InputContainer,
} from '../Login/styles';

import { Container, Content, PageTitle } from './styles';

const ForgotPassword: React.FC = () => {
    const { goBack } = useNavigation();

    const [email, setEmail] = useState<string>('');

    const handleEmailChange = useCallback(
        (value: string) => setEmail(value),
        []
    );

    const handleRecoveryPassword = useCallback(async () => {
        if (email.trim() === '') {
            showMessage({
                message: 'Digite o email',
                type: 'warning',
            });
            return;
        }

        try {
            await recoveryPassword({ email });

            showMessage({
                message:
                    'Um e-mail foi enviado com um link para recuperar sua senha',
                type: 'info',
            });

            goBack();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [email, goBack]);
    return (
        <Container>
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>Recuperar senha</PageTitle>
            </Content>

            <FormContainer>
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
                </LoginForm>
                <Button text="Recuperar" onPress={handleRecoveryPassword} />
            </FormContainer>
        </Container>
    );
};

export default ForgotPassword;
