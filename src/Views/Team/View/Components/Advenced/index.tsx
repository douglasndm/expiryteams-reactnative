import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import { useTeam } from '~/Contexts/TeamContext';

import { deleteTeam } from '~/Functions/Team';

import Loading from '~/Components/Loading';

import { Section, SectionTitle, SubscriptionDescription } from '../../styles';

import { OptionContainer, ButtonPaper, Icons } from './styles';

const Advenced: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showDeleteTeam, setShowDeleteTeam] = useState<boolean>(false);

    const teamContext = useTeam();

    const { reset } = useNavigation();

    const handleSwitchShowDeleteTeam = useCallback(() => {
        setShowDeleteTeam(!showDeleteTeam);
    }, [showDeleteTeam]);

    const handleDeleteTeam = useCallback(async () => {
        try {
            setIsLoading(true);

            if (!teamContext.id) {
                throw new Error('Team is not selected');
            }

            await deleteTeam({ team_id: teamContext.id });

            showMessage({
                message: 'O time foi apagado',
                type: 'info',
            });

            reset({
                routes: [{ name: 'TeamList' }],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [reset, teamContext.id]);
    return isLoading ? (
        <Loading />
    ) : (
        <Section>
            <SectionTitle>Avançado</SectionTitle>

            <SubscriptionDescription>
                Configurações avançadas do time
            </SubscriptionDescription>

            <OptionContainer>
                <ButtonPaper
                    icon={() => <Icons name="trash-outline" size={22} />}
                    onPress={handleSwitchShowDeleteTeam}
                >
                    Apagar time
                </ButtonPaper>
            </OptionContainer>

            <Dialog.Container
                visible={showDeleteTeam}
                onBackdropPress={handleSwitchShowDeleteTeam}
            >
                <Dialog.Title>Apagar time</Dialog.Title>
                <Dialog.Description>
                    Você tem certeza que deseja apagar o time? todos as
                    categorias, produtos e lotes dele também serão apagados e
                    essa ação não pode ser desfeita
                </Dialog.Description>
                <Dialog.Button
                    label="Cancelar"
                    onPress={handleSwitchShowDeleteTeam}
                />
                <Dialog.Button
                    label="Apagar time"
                    color="red"
                    onPress={handleDeleteTeam}
                />
            </Dialog.Container>
        </Section>
    );
};

export default Advenced;
