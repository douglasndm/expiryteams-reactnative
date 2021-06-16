import React, { useState, useEffect, useCallback, useContext } from 'react';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import Preferences from '~/Contexts/PreferencesContext';

import { getUser, updateUser } from '~/Functions/User';

import Header from '~/Components/Header';
import Loading from '~/Components/Loading';

import {
    Container,
    Content,
    InputGroup,
    InputTextContainer,
    InputText,
    InputTextTip,
    ActionsButtonContainer,
    ActionButton,
    Icons,
} from './styles';

const User: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { preferences, setPreferences } = useContext(Preferences);

    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const [nameError, setNameError] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const user = await getUser();

            if (user.name) setName(user.name);
            if (user.lastName) setLastName(user.lastName);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleUpdate = useCallback(async () => {
        try {
            setIsLoading(true);

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
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [lastName, name, preferences, setPreferences]);

    const handleNameChange = useCallback((value: string) => {
        setName(value);
        setNameError(false);
    }, []);

    const handleLastNameChange = useCallback((value: string) => {
        setLastName(value);
    }, []);

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

                <ActionsButtonContainer>
                    <ActionButton
                        icon={() => <Icons name="save-outline" size={22} />}
                        onPress={handleUpdate}
                    >
                        Atualizar
                    </ActionButton>

                    <ActionButton
                        icon={() => <Icons name="trash-outline" size={22} />}
                        onPress={() => {}}
                    >
                        Apagar
                    </ActionButton>
                </ActionsButtonContainer>
                <Container />
            </Content>
        </Container>
    );
};

export default User;
