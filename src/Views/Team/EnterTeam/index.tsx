import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { enterTeamCode } from '~/Functions/Team/Users';

import Button from '~/Components/Button';
import Header from '~/Components/Header';

import {
    Container,
    InviteText,
    CodeContaider,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
} from './styles';

const EnterTeam: React.FC = () => {
    const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();
    const { params } = useRoute<RouteProp<RoutesParams, 'EnterTeam'>>();

    const [isMounted, setIsMounted] = useState(true);

    const userRole = useMemo(() => {
        return params.userRole || null;
    }, [params]);

    const [userCode, setUserCode] = useState<string>('');
    const [isAddingCode, setIsAddingCode] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const handleOnCodeChange = useCallback((value: string) => {
        setUserCode(value);
    }, []);

    const handleSubmitCode = useCallback(async () => {
        if (isMounted) return;
        try {
            setIsAddingCode(true);

            if (userCode.trim() === '') {
                setInputHasError(true);
                setInputErrorMessage(
                    'Digite o seu código de entrada para o time'
                );
                return;
            }

            await enterTeamCode({
                code: userCode,
                team_id: userRole.team.id,
            });

            // View_TeamList_InvalidTeamCode
            showMessage({
                message: strings.View_TeamList_SuccessCode,
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
            setIsAddingCode(false);
        }
    }, [isMounted, reset, userCode, userRole.team.id]);

    useEffect(() => {
        return () => setIsMounted(false);
    });

    return (
        <Container>
            <Header title="Entrar no time" noDrawer />

            {!!userRole.team.name && (
                <InviteText>
                    Você foi convidado para entrar no time {userRole.team.name}.
                </InviteText>
            )}

            <CodeContaider>
                <InputContainer>
                    <InputTextContainer hasError={inputHasError}>
                        <InputText
                            value={userCode}
                            onChangeText={handleOnCodeChange}
                            placeholder={
                                strings.View_TeamList_InputText_EnterCode_Placeholder
                            }
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </InputTextContainer>
                    {!!inputErrorMessage && (
                        <InputTextTip>{inputErrorMessage}</InputTextTip>
                    )}
                </InputContainer>
            </CodeContaider>
            <Button
                text="Entrar no time"
                onPress={handleSubmitCode}
                isLoading={isAddingCode}
            />
        </Container>
    );
};

export default EnterTeam;
