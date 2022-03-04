import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { StackNavigationProp } from '@react-navigation/stack';
import { useTeam } from '~/Contexts/TeamContext';

import { editTeam } from '~/Functions/Team';
import {
    getSelectedTeam,
    setSelectedTeam,
} from '~/Functions/Team/SelectedTeam';

import Header from '~/Components/Header';
import Input from '~/Components/InputText';
import Button from '~/Components/Button';

import { Container, Content, InputGroup, InputTextTip } from './styles';

const Edit: React.FC = () => {
    const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

    const teamContext = useTeam();

    const [isMounted, setIsMounted] = useState(true);

    const [name, setName] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [nameError, setNameError] = useState<string>('');

    const handleUpdate = useCallback(async () => {
        if (!teamContext.id || !isMounted) {
            return;
        }
        try {
            setIsUpdating(true);

            if (!name) {
                setNameError('Nome do time não pode está em branco');
                return;
            }

            await editTeam({ team_id: teamContext.id, name });

            const settedTeam = await getSelectedTeam();

            if (settedTeam) {
                await setSelectedTeam({
                    ...settedTeam,
                    team: {
                        ...settedTeam.team,
                        name,
                    },
                });

                if (teamContext.reload) {
                    teamContext.reload();
                }
            }

            showMessage({
                message: 'Time editado',
                type: 'info',
            });

            pop();
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsUpdating(false);
        }
    }, [isMounted, name, pop, teamContext]);

    const handleNameChange = useCallback((value: string) => {
        setName(value);
    }, []);

    useEffect(() => {
        if (teamContext.name) {
            setName(teamContext.name);
        }
    }, [teamContext.name]);

    useEffect(() => {
        return () => setIsMounted(false);
    }, []);
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
                        contentStyle={{ flex: 1 }}
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
