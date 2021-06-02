import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { createAccount } from '~/Functions/Auth/Account';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';

import {
    FormContainer,
    LoginForm,
    InputContainer,
    InputText,
} from '../Login/styles';
import { Container, Content, PageTitle } from './styles';

const CreateAccount: React.FC = () => {
    const { goBack, reset } = useNavigation();

    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const handleNameChange = useCallback((value: string) => setName(value), []);
    const handleLastNameChange = useCallback(
        (value: string) => setLastName(value),
        []
    );
    const handleEmailChange = useCallback(
        (value: string) => setEmail(value),
        []
    );

    const handlePasswordChange = useCallback(
        (value: string) => setPassword(value),
        []
    );

    const handlePasswordConfirmChange = useCallback(
        (value: string) => setPasswordConfirm(value),
        []
    );

    const handleCreateAccount = useCallback(async () => {
        if (
            name.trim() === '' ||
            lastName.trim() === '' ||
            email.trim() === '' ||
            password.trim() === '' ||
            passwordConfirm.trim() === ''
        ) {
            showMessage({
                message: 'Todos os campos são obrigatorios',
                type: 'warning',
            });
            return;
        }

        if (password !== passwordConfirm) {
            showMessage({
                message: 'A confirmação da senha não é válida',
                type: 'warning',
            });
            return;
        }

        try {
            const response = await createAccount({
                name,
                lastName,
                email,
                password,
                passwordConfirm,
            });

            showMessage({
                message: 'Conta criada!',
                description:
                    'Clique no link enviado ao seu e-mail para começar a usar sua conta.',
                type: 'info',
            });

            reset({ routes: [{ name: 'Login' }] });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'warning',
            });
        }
    }, [email, lastName, name, password, passwordConfirm, reset]);

    return (
        <Container>
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>Criar conta</PageTitle>
            </Content>

            <FormContainer>
                <LoginForm>
                    <InputContainer>
                        <InputText
                            placeholder="Nome"
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={name}
                            onChangeText={handleNameChange}
                        />
                    </InputContainer>
                    <InputContainer>
                        <InputText
                            placeholder="Sobrenome"
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={lastName}
                            onChangeText={handleLastNameChange}
                        />
                    </InputContainer>
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
                            placeholder="Senha"
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry
                            value={password}
                            onChangeText={handlePasswordChange}
                        />
                    </InputContainer>
                    <InputContainer>
                        <InputText
                            placeholder="Confirmação da senha"
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry
                            value={passwordConfirm}
                            onChangeText={handlePasswordConfirmChange}
                        />
                    </InputContainer>
                </LoginForm>

                <Button text="Cria conta" onPress={handleCreateAccount} />
            </FormContainer>
        </Container>
    );
};

export default CreateAccount;
