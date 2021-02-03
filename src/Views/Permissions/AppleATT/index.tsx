import React, { useState, useCallback } from 'react';
import { Switch } from 'react-native';
import RNPermissions, { request } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';

import { setAllowedToReadIDFA } from '~/Functions/Privacy';

import Button from '~/Components/Button';

import {
    Container,
    Content,
    PageTitle,
    Message,
    SettingContainer,
    SettingTitle,
} from './styles';

const AppleATT: React.FC = () => {
    const { reset } = useNavigation();

    const [deviceId, setDeviceId] = useState<boolean>(true);

    const onDeviceIdChange = useCallback((value) => {
        setDeviceId(value);
    }, []);

    const handleContinue = useCallback(async () => {
        let response = null;

        if (deviceId) {
            response = await request(
                RNPermissions.PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
            );
        }

        if (response === 'granted') {
            await setAllowedToReadIDFA(true);
        } else {
            await setAllowedToReadIDFA(false);
        }

        reset({
            routes: [{ name: 'Home' }],
        });
    }, [reset, deviceId]);

    return (
        <Container>
            <Content>
                <PageTitle>Precisamos da sua permissão</PageTitle>
                <Message>
                    Precisamos da sua autorização para usar o identificador
                    único do seu dispositivo ara mostra-lo anúncios mais
                    relevantes e fazer análises de quais parte do aplicativo
                    precisam melhorar. Por favor note que desativando estas
                    opções não removeram os anúncios caso não seja usuário PRO,
                    só fala que os anúncios não sejam tão interessantes para
                    você como poderiam ser. Os anúncios no aplicativo são umas
                    das poucas formas de renda deste aplicativo e com anúncios
                    mais relevantes você estaria contribuindo para o
                    desenvolvimento e manutenção do aplicativo.
                </Message>

                <SettingContainer>
                    <SettingTitle>
                        Uso da identificação única do dispositivo
                    </SettingTitle>
                    <Switch value={deviceId} onValueChange={onDeviceIdChange} />
                </SettingContainer>

                <Button text="Continuar" onPress={handleContinue} />
            </Content>
        </Container>
    );
};

export default AppleATT;
