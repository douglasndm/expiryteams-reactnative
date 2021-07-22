import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { createAccount } from '~/Functions/Auth/Account';

import Header from '~/Components/Header';
import Input from '~/Components/InputText';
import Button from '~/Components/Button';

import { FormContainer } from '../Login/styles';
import { Container } from './styles';

const CreateAccount: React.FC = () => {
    const { reset } = useNavigation();

    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleNameChange = useCallback((value: string) => setName(value), []);
    const handleLastNameChange = useCallback(
        (value: string) => setLastName(value),
        []
    );
    const handleEmailChange = useCallback(
        (value: string) => setEmail(value.trim()),
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
        const schema = Yup.object().shape({
            name: Yup.string().required('Digite o seu nome'),
            lastName: Yup.string().required('Digite seu sobrenome'),
            email: Yup.string()
                .required('E-mail é obrigátio')
                .email('E-mail inválido'),
            password: Yup.string().required('Digite a senha').min(6),
            passwordConfirm: Yup.string().oneOf(
                [Yup.ref('password'), null],
                'Confirmação da senha não corresponde a senha'
            ),
        });

        try {
            await schema.validate({
                name,
                lastName,
                email,
                password,
                passwordConfirm,
            });
        } catch (err) {
            showMessage({
                message: err.errors[0],
                type: 'warning',
            });
            return;
        }

        try {
            setIsCreating(true);
            await createAccount({
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
        } finally {
            setIsCreating(false);
        }
    }, [email, lastName, name, password, passwordConfirm, reset]);

    return (
        <Container>
            <Header title="Criar conta" noDrawer />

            <FormContainer>
                <Input
                    placeholder="Nome"
                    autoCorrect={false}
                    autoCapitalize="words"
                    value={name}
                    onChange={handleNameChange}
                    contentStyle={{ marginBottom: 7 }}
                />

                <Input
                    placeholder="Sobrenome"
                    autoCorrect={false}
                    autoCapitalize="words"
                    value={lastName}
                    onChange={handleLastNameChange}
                    contentStyle={{ marginBottom: 7 }}
                />

                <Input
                    placeholder={strings.View_Login_InputText_Email_Placeholder}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={email}
                    onChange={handleEmailChange}
                    contentStyle={{ marginBottom: 7 }}
                />

                <Input
                    placeholder="Senha"
                    autoCorrect={false}
                    autoCapitalize="none"
                    isPassword
                    value={password}
                    onChange={handlePasswordChange}
                    contentStyle={{ marginBottom: 7 }}
                />

                <Input
                    placeholder="Confirmação da senha"
                    autoCorrect={false}
                    autoCapitalize="none"
                    isPassword
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                    contentStyle={{ marginBottom: 7 }}
                />

                <Button
                    text="Cria conta"
                    onPress={handleCreateAccount}
                    isLoading={isCreating}
                />
            </FormContainer>
        </Container>
    );
};

export default CreateAccount;
