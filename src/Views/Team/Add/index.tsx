import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { createTeam } from '~/Functions/Team';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';
import StatusBar from '~/Components/StatusBar';

import {
    Container,
    PageHeader,
    PageTitle,
    Content,
    InputTextContainer,
    InputText,
    InputTextTip,
} from './styles';

const Add: React.FC = () => {
    const { goBack, reset } = useNavigation();

    const [name, setName] = useState<string>('');
    const [nameFieldError, setNameFieldError] = useState<boolean>(false);

    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleCreate = useCallback(async () => {
        try {
            setIsCreating(true);

            if (name.trim() === '') {
                setNameFieldError(true);
                return;
            }

            await createTeam({
                name,
            });

            showMessage({
                message: translate('View_CreateTeam_Message_SuccessCreated'),
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
            setIsCreating(false);
        }
    }, [name, reset]);

    return (
        <Container>
            <StatusBar />

            <PageHeader>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{translate('View_CreateTeam_PageTitle')}</PageTitle>
            </PageHeader>

            <Content>
                <InputTextContainer hasError={nameFieldError}>
                    <InputText
                        placeholder={translate(
                            'View_CreateTeam_InputText_Name_Placeholder'
                        )}
                        value={name}
                        onChangeText={value => {
                            setName(value);
                            setNameFieldError(false);
                        }}
                    />
                </InputTextContainer>

                {nameFieldError && (
                    <InputTextTip>
                        {translate(
                            'View_CreateTeam_InputText_Name_Erro_EmptyText'
                        )}
                    </InputTextTip>
                )}

                <Button
                    text={translate('View_CreateTeam_Button_CreateTeam')}
                    isLoading={isCreating}
                    onPress={handleCreate}
                />
            </Content>
        </Container>
    );
};

export default Add;
