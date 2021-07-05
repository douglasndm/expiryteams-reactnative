import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { StackNavigationProp } from '@react-navigation/stack';
import { useTeam } from '~/Contexts/TeamContext';

import { editTeam } from '~/Functions/Team';

import Header from '~/Components/Header';
import Input from '~/Components/InputText';
import Button from '~/Components/Button';

import { Container, Content, InputGroup, InputTextTip } from './styles';

const Edit: React.FC = () => {
    const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

    const teamContext = useTeam();

    const [name, setName] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [nameError, setNameError] = useState<string>('');

    const handleUpdate = useCallback(async () => {
        if (!teamContext.id) {
            return;
        }
        try {
            setIsUpdating(true);

            if (!name) {
                setNameError('Nome do time não pode está em branco');
            }

            await editTeam({ team_id: teamContext.id, name });

            showMessage({
                message: 'Time editado',
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
    }, [name, pop, teamContext.id]);

    const handleNameChange = useCallback((value: string) => {
        setName(value);
    }, []);

    useEffect(() => {
        if (teamContext.name) {
            setName(teamContext.name);
        }
    }, [teamContext.name]);
    return (
        <Container>
            <Header title="Editar time" noDrawer />

            <Content>
                <InputGroup>
                    <Input
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Nome do time"
                        hasError={!!nameError}
                    />
                </InputGroup>
                {!!nameError && <InputTextTip>{nameError}</InputTextTip>}

                <Button
                    text="Atualizar"
                    onPress={handleUpdate}
                    isLoading={isUpdating}
                />
            </Content>
        </Container>
    );
};

export default Edit;
