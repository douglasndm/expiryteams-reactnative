import React, { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { enterTeamCode } from '~/Functions/Team/Users';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';

import {
    Container,
    PageHeader,
    PageTitle,
    InviteText,
    CodeContaider,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
} from './styles';

interface Props {
    userRole: IUserRoles;
}

const EnterTeam: React.FC<Props> = () => {
    const { goBack, reset } = useNavigation();
    const { params } = useRoute<RouteProp<Props, 'userRole'>>();

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
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsAddingCode(false);
        }
    }, [reset, userCode, userRole.team.id]);

    return (
        <Container>
            <PageHeader>
                <BackButton handleOnPress={goBack} />
                <PageTitle>Entrar no time</PageTitle>
            </PageHeader>

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
