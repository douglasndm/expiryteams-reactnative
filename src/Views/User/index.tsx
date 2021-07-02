import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Dialog from 'react-native-dialog';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';

import { deleteUser } from '~/Functions/User';
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
    ActionButton,
    Icons,
    DeleteAccountContainer,
    DeleteAccountText,
} from './styles';

const User: React.FC = () => {
    const { reset, pop } = useNavigation<StackNavigationProp<RoutesParams>>();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false);

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

        // this should be before try catch cause it has it own try catch
        try {
            if (password) {
                const schema = Yup.object().shape({
                    newPassword: Yup.string().required('Digite a senha').min(6),
                    newPasswordConfi: Yup.string().oneOf(
                        [Yup.ref('newPassword'), null],
                        'Confirmação da senha não pode está em branco e deve ser a mesma que a nova senha'
                    ),
                });

                await schema.validate({ newPassword, newPasswordConfi });

                await updatePassword({
                    password,
                    newPassword,
                });
            }
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

    const handleDelete = useCallback(async () => {
        try {
            setIsLoading(true);

            await deleteUser();

            showMessage({
                message: 'Conta permanentemente apagada',
                type: 'warning',
            });

            reset({
                routes: [{ name: 'Logout' }],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [reset]);

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

    const handlwSwitchDeleteVisible = useCallback(() => {
        setIsDeleteVisible(!isDeleteVisible);
    }, [isDeleteVisible]);

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

            <DeleteAccountContainer>
                <ActionButton
                    icon={() => <Icons name="trash-outline" size={22} />}
                    onPress={handlwSwitchDeleteVisible}
                >
                    <DeleteAccountText>Apagar conta</DeleteAccountText>
                </ActionButton>
            </DeleteAccountContainer>

            <Dialog.Container
                visible={isDeleteVisible}
                onBackdropPress={handlwSwitchDeleteVisible}
            >
                <Dialog.Title>ATENÇÃO</Dialog.Title>
                <Dialog.Description>
                    Apagando sua conta TODOS OS SEUS DADOS serão apagados
                    permanemente. Se houver assinaturas ativas as mesmas deverão
                    ser canceladas na App Store ou Google Play. Você será
                    removido de todos os times que faz parte e dos quais você é
                    gerente o time e todos os seus produtos/lotes/categorias
                    serão permanemente apagados Está ação não pode ser desfeita.
                    Você tem certeza?
                </Dialog.Description>
                <Dialog.Button
                    label="Manter conta"
                    onPress={handlwSwitchDeleteVisible}
                />
                <Dialog.Button
                    label="APAGAR TUDO"
                    color="red"
                    onPress={handleDelete}
                />
            </Dialog.Container>
        </Container>
    );
};

export default User;
