import React, { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '~/Contexts/TeamContext';

import { isSubscriptionActive } from '~/Functions/Team/Subscriptions';
import { deleteTeam } from '~/Functions/Team';

import Header from '~/Components/Header';
import Button from '~/Components/Button';

import {
    Container,
    Content,
    ActionTitle,
    ActionDescription,
    ActionConsequence,
    CheckBoxContainer,
    CheckBox,
    BlockContainer,
    BlockTitle,
    BlockDescription,
    Link,
} from './styles';

const Team: React.FC = () => {
    const { navigate, reset } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();
    const teamContext = useTeam();

    const [activesSubs, setActivesSubs] = useState<boolean>(false);

    const [agreeConsequence, setAgreeConsequence] = useState<boolean>(false);
    const [enableExcel, setEnableExcel] = useState<boolean>(false);
    const [allSubsCanceled, setAllSubsCanceled] = useState<boolean>(false);

    const [isCheckingSub, setIsCheckingSub] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const loadSubscriptions = useCallback(async () => {
        if (!teamContext.id) {
            return;
        }

        const isActive = await isSubscriptionActive(teamContext.id);

        setActivesSubs(isActive);
    }, [teamContext.id]);

    const handleChangeAgree = useCallback(() => {
        setEnableExcel(!enableExcel);
    }, [enableExcel]);

    const handleChangeSubs = useCallback(() => {
        setAgreeConsequence(!agreeConsequence);
    }, [agreeConsequence]);

    const handleExcelExport = useCallback(() => {
        navigate('Export');
    }, [navigate]);

    const handleCheckSubscription = useCallback(async () => {
        try {
            setIsCheckingSub(true);

            await loadSubscriptions();

            setAllSubsCanceled(true);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsCheckingSub(false);
        }
    }, [loadSubscriptions]);

    const handleDeleteTeam = useCallback(async () => {
        try {
            setIsDeleting(true);
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
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsDeleting(false);
        }
    }, [reset, teamContext.id]);

    const handleGoToStore = useCallback(async () => {
        if (activesSubs) {
            const storeLink =
                Platform.OS === 'ios'
                    ? 'https://apps.apple.com/account/subscriptions'
                    : 'https://play.google.com/store/account/subscriptions';

            await Linking.openURL(storeLink);
        }
    }, [activesSubs]);

    useEffect(() => {
        loadSubscriptions();
    }, []);

    return (
        <Container>
            <Header title="Apagar time" noDrawer />

            <Content>
                <ActionTitle>ATEN????O ??????</ActionTitle>

                <ActionDescription>
                    Todos os produtos, lotes e categorias do time ser??o
                    permanemente removidos, voc?? precisa ter absuluta certeza do
                    que est?? fazendo.
                </ActionDescription>
                <ActionConsequence>
                    Est?? a????o n??o pode ser desfeita
                </ActionConsequence>

                <CheckBoxContainer>
                    <CheckBox
                        isChecked={enableExcel}
                        onPress={handleChangeAgree}
                        disableBuiltInState
                        bounceFriction={10}
                        text="Entendo o que estou fazendo"
                    />
                </CheckBoxContainer>

                <BlockContainer isEnable={enableExcel}>
                    <BlockTitle>Exportar produtos</BlockTitle>
                    <BlockDescription>
                        Antes de ir, ?? recomendando gerar um arquivo Excel com
                        todos os seus produtos
                    </BlockDescription>

                    <Button text="Gerar arquivo" onPress={handleExcelExport} />

                    <CheckBoxContainer>
                        <CheckBox
                            isChecked={agreeConsequence}
                            onPress={handleChangeSubs}
                            disableBuiltInState
                            bounceFriction={10}
                            style={{ marginTop: -15 }}
                            text="J?? exportei ou n??o quero exportar"
                        />
                    </CheckBoxContainer>
                </BlockContainer>

                <BlockContainer isEnable={agreeConsequence && enableExcel}>
                    <BlockTitle>Suas assinaturas</BlockTitle>
                    <BlockDescription>
                        Voc?? tem assinaturas pendentes. Voc?? ter?? que cancelar a
                        sua assinatura manualmente na loja de aplicativos. N??o
                        haver?? reembolso caso sua assinatura n??o tenha acabado o
                        prazo. ?? recomendado usar todo o periodo da assinatura
                        antes de apagar o time
                    </BlockDescription>

                    {activesSubs && (
                        <Link onPress={handleGoToStore}>Ir para a loja</Link>
                    )}

                    <Button
                        text="Checar se assinatura foi cancelada"
                        isLoading={isCheckingSub}
                        onPress={handleCheckSubscription}
                    />
                </BlockContainer>

                <BlockContainer
                    isEnable={
                        allSubsCanceled &&
                        agreeConsequence &&
                        enableExcel &&
                        !activesSubs
                    }
                >
                    <BlockTitle>Concluir</BlockTitle>
                    <BlockDescription>
                        ATEN????O: CONTINUANDO O TIME, SEUS PRODUTOS, LOTES E
                        CATEGORIAS SER??O PERMANEMENTE APAGADOS. TODOS OS
                        USU??RIOS DO TIME SER??O REMOVIDOS. ESSA A????O N??O PODE SER
                        DESFEITA
                    </BlockDescription>

                    <Button
                        text="Apagar time"
                        onPress={handleDeleteTeam}
                        isLoading={isDeleting}
                        contentStyle={{ backgroundColor: '#b00c17' }}
                    />
                </BlockContainer>
            </Content>
        </Container>
    );
};

export default Team;
