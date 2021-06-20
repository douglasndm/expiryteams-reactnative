import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Dialog from 'react-native-dialog';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';
import Preferences from '~/Contexts/PreferencesContext';

import { getUser, updateUser, deleteUser } from '~/Functions/User';

import Button from '~/Components/Button';
import Header from '~/Components/Header';
import Loading from '~/Components/Loading';

import {
    Container,
    Content,
    InputGroup,
    InputTextContainer,
    InputText,
    InputTextTip,
    ActionButton,
    Icons,
    DeleteAccountContainer,
    DeleteAccountText,
} from './styles';

const User: React.FC = () => {
    const { reset, replace } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false);

    const { preferences, setPreferences } = useContext(Preferences);

    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const [nameError, setNameError] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (!user) {
                throw new Error('User is not logged');
            }
            const ownUser = await getUser({ user_id: user.uid });

            if (!ownUser) {
                throw new Error("User doesn't exist in onw database");
            }

            if (ownUser.name) setName(ownUser.name);
            if (ownUser.lastName) setLastName(ownUser.lastName);
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
        try {
            setIsUpdating(true);

            const updatedUser = await updateUser({
                name,
                lastName,
            });

            setPreferences({
                ...preferences,
                user: updatedUser,
            });

            showMessage({
                message: 'Perfil atualizado',
                type: 'info',
            });

            replace('Home', {});
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsUpdating(false);
        }
    }, [lastName, name, preferences, replace, setPreferences]);

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

    const handleLastNameChange = useCallback((value: string) => {
        setLastName(value);
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
            <Header title="Perfil" />

            <Content>
                <InputGroup>
                    <InputTextContainer hasError={nameError}>
                        <InputText
                            placeholder="Nome"
                            value={name}
                            onChangeText={handleNameChange}
                        />
                    </InputTextContainer>
                </InputGroup>
                {nameError && (
                    <InputTextTip>Digite o nome do usuário</InputTextTip>
                )}

                <InputGroup>
                    <InputTextContainer>
                        <InputText
                            placeholder="Sobrenome"
                            value={lastName}
                            onChangeText={handleLastNameChange}
                        />
                    </InputTextContainer>
                </InputGroup>

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
