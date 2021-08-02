import React, { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllSubscriptionsFromRevenue } from '~/Functions/Team/Subscriptions';
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
    const { navigate, reset } = useNavigation();
    const teamContext = useTeam();

    const [activesSubs, setActivesSubs] = useState<Subscription[]>([]);

    const [agreeConsequence, setAgreeConsequence] = useState<boolean>(false);
    const [enableExcel, setEnableExcel] = useState<boolean>(false);
    const [allSubsCanceled, setAllSubsCanceled] = useState<boolean>(false);

    const [isCheckingSub, setIsCheckingSub] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const loadSubscriptions = useCallback(async () => {
        if (!teamContext.id) {
            return;
        }

        const response = await getAllSubscriptionsFromRevenue({
            team_id: teamContext.id,
        });

        const actives = response.filter(sub => {
            if (sub.subscription.unsubscribe_detected_at !== null) {
                return false;
            }
            return true;
        });

        setActivesSubs(actives);
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
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsDeleting(false);
        }
    }, [reset, teamContext.id]);

    const handleGoToStore = useCallback(async () => {
        if (activesSubs.length > 0) {
            const storeLink =
                activesSubs[0].subscription.store === 'app_store'
                    ? 'https://apps.apple.com/account/subscriptions'
                    : 'https://play.google.com/store/account/subscriptions';

            await Linking.openURL(storeLink);
        }
    }, [activesSubs]);

    useEffect(() => {
        loadSubscriptions();
    }, [loadSubscriptions]);

    return (
        <Container>
            <Header title="Apagar time" noDrawer />

            <Content>
                <ActionTitle>ATENÇÃO ⚠️</ActionTitle>

                <ActionDescription>
                    Todos os produtos, lotes e categorias do time serão
                    permanemente removidos, você precisa ter absuluta certeza do
                    que está fazendo.
                </ActionDescription>
                <ActionConsequence>
                    Está ação não pode ser desfeita
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
                        Antes de ir, é recomendando gerar um arquivo Excel com
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
                            text="Já exportei ou não quero exportar"
                        />
                    </CheckBoxContainer>
                </BlockContainer>

                <BlockContainer isEnable={agreeConsequence && enableExcel}>
                    <BlockTitle>Suas assinaturas</BlockTitle>
                    <BlockDescription>
                        Você tem assinaturas pendentes. Você terá que cancelar a
                        sua assinatura manualmente na loja de aplicativos. Não
                        haverá reembolso caso sua assinatura não tenha acabado o
                        prazo. É recomendado usar todo o periodo da assinatura
                        antes de apagar o time
                    </BlockDescription>

                    {activesSubs.length > 0 && (
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
                        activesSubs.length <= 0
                    }
                >
                    <BlockTitle>Concluir</BlockTitle>
                    <BlockDescription>
                        ATENÇÃO: CONTINUANDO O TIME, SEUS PRODUTOS, LOTES E
                        CATEGORIAS SERÃO PERMANEMENTE APAGADOS. TODOS OS
                        USUÁRIOS DO TIME SERÃO REMOVIDOS. ESSA AÇÃO NÃO PODE SER
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
