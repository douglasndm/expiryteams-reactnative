import React, { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { deleteUser } from '~/Functions/User';

import Header from '~/Components/Header';
import Loading from '~/Components/Loading';
import Button from '~/Components/Button';

import {
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
} from '../Team/styles';

import { Container } from './styles';

const User: React.FC = () => {
    const { navigate } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isCheckingTeams, setIsCheckingTeams] = useState<boolean>(false);

    const [agreeConsequence, setAgreeConsequence] = useState<boolean>(false);

    const [activesTeams, setActivesTeams] = useState([]);

    const handleChangeAgreeConsequence = useCallback(() => {
        setAgreeConsequence(!agreeConsequence);
    }, [agreeConsequence]);

    const handleDelete = useCallback(async () => {
        try {
            setIsDeleting(true);

            await deleteUser({ password: '' });

            navigate('Logout');
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsDeleting(false);
        }
    }, [navigate]);

    const handleGoToStore = useCallback(async () => {
        if (activesTeams.length > 0) {
            const storeLink =
                activesTeams[0].subscription.store === 'app_store'
                    ? 'https://apps.apple.com/account/subscriptions'
                    : 'https://play.google.com/store/account/subscriptions';

            await Linking.openURL(storeLink);
        }
    }, [activesTeams]);

    const handleReCheckTeams = useCallback(async () => {}, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title="Apagar conta" noDrawer />

            <Content>
                <ActionTitle>ATENÇÃO ⚠️</ActionTitle>

                <ActionDescription>
                    Seu perfil será permanemente apagando e você será removido
                    de todos os times que faz parte.
                </ActionDescription>
                <ActionConsequence>
                    Está ação não pode ser desfeita
                </ActionConsequence>

                <CheckBoxContainer>
                    <CheckBox
                        isChecked={agreeConsequence}
                        onPress={handleChangeAgreeConsequence}
                        disableBuiltInState
                        bounceFriction={10}
                        text="Entendo o que estou fazendo"
                    />
                </CheckBoxContainer>

                <BlockContainer isEnable={agreeConsequence}>
                    <BlockTitle>Seus times</BlockTitle>
                    <BlockDescription>
                        Você é gerente de um time que tem assinatura ativa. Você
                        deve cancelar a assinatura primeiro
                    </BlockDescription>

                    {activesTeams.length > 0 && (
                        <Link onPress={handleGoToStore}>Ir para a loja</Link>
                    )}

                    <Button
                        text="Checar se assinatura foi cancelada"
                        isLoading={isCheckingTeams}
                        onPress={handleReCheckTeams}
                    />
                </BlockContainer>

                <BlockContainer
                    isEnable={agreeConsequence && activesTeams.length < 0}
                >
                    <BlockTitle>Concluir</BlockTitle>
                    <BlockDescription>
                        ATENÇÃO: CONTINUANDO, SUA CONTA SERÁ PERMANENTEMENTE
                        APAGADA. ESSA AÇÃO NÃO PODE SER DESFEITA
                    </BlockDescription>

                    <Button
                        text="Apagar conta"
                        onPress={handleDelete}
                        isLoading={isDeleting}
                        contentStyle={{ backgroundColor: '#b00c17' }}
                    />
                </BlockContainer>
            </Content>
        </Container>
    );
};

export default User;
