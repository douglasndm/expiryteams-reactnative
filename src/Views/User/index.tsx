import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';

import {
    updateUser,
    updateEmail,
    updatePassword,
} from '~/Functions/Auth/Account';

import Button from '~/Components/Button';
import Header from '~/Components/Header';
import Loading from '~/Components/Loading';
import Input from '~/Components/InputText';

import {
    Container,
    Content,
    InputGroupTitle,
    InputGroup,
    InputTextTip,
} from './styles';

const User: React.FC = () => {
    const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfi, setNewPasswordConfi] = useState<string>('');

    const [nameError, setNameError] = useState<boolean>(false);
    const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
    const [newPasswordConfiError, setNewPasswordConfiError] = useState<boolean>(
        false
    );

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (!user) {
                throw new Error('User is not logged');
            }

            if (user.displayName) setName(user.displayName);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const handleUpdate = useCallback(async () => {
        setIsUpdating(true);

        try {
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome é obrigatório'),
            });

            await schema.validate({ name });

            if (password) {
                const schemaPass = Yup.object().shape({
                    newPassword: Yup.string().required('Digite a senha').min(6),
                    newPasswordConfi: Yup.string().oneOf(
                        [Yup.ref('newPassword'), null],
                        'Confirmação da senha não pode está em branco e deve ser a mesma que a nova senha'
                    ),
                });

                await schemaPass.validate({ newPassword, newPasswordConfi });
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
            setIsUpdating(false);
            return;
        }

        if (password) {
            try {
                await updatePassword({
                    password,
                    newPassword,
                });
            } catch (err) {
                let error = err.message;
                if (err.code === 'auth/wrong-password') {
                    error = 'Senha incorreta';
                }
                showMessage({
                    message: error,
                    type: 'danger',
                });
                setIsUpdating(false);
                return;
            }
        }

        try {
            await updateUser({
                name,
            });

            showMessage({
                message: 'Perfil atualizado',
                type: 'info',
            });

            pop();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsUpdating(false);
        }
    }, [name, newPassword, newPasswordConfi, password, pop]);

    const handleNameChange = useCallback((value: string) => {
        setName(value);
        setNameError(false);
    }, []);

    const handlePasswordChange = useCallback((value: string) => {
        setPassword(value);
    }, []);

    const handleNewPasswordChange = useCallback((value: string) => {
        setNewPassword(value);
        setNewPasswordError(false);
    }, []);

    const handleNewPasswordConfiChange = useCallback((value: string) => {
        setNewPasswordConfi(value);
        setNewPasswordConfiError(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title="Perfil" noDrawer />

            <Content>
                <InputGroup>
                    <Input
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Nome"
                        hasError={nameError}
                    />
                </InputGroup>
                {nameError && (
                    <InputTextTip>Digite o nome do usuário</InputTextTip>
                )}

                <InputGroupTitle>Alteração de senha</InputGroupTitle>
                <InputGroup>
                    <Input
                        placeholder="Senha atual"
                        value={password}
                        onChange={handlePasswordChange}
                        isPassword
                    />
                </InputGroup>

                <InputGroup>
                    <Input
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        hasError={newPasswordError}
                        isPassword
                    />
                </InputGroup>
                {newPasswordError && (
                    <InputTextTip>Digite sua nova senha</InputTextTip>
                )}

                <InputGroup>
                    <Input
                        placeholder="Confirmação da senha"
                        value={newPasswordConfi}
                        onChange={handleNewPasswordConfiChange}
                        hasError={newPasswordConfiError}
                        isPassword
                    />
                </InputGroup>
                {newPasswordConfiError && (
                    <InputTextTip>Confirme sua nova senha</InputTextTip>
                )}

                <Button
                    text="Atualizar"
                    onPress={handleUpdate}
                    isLoading={isUpdating}
                />
            </Content>
        </Container>
    );
};

export default User;
