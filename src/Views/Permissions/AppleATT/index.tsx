import React, { useState, useCallback } from 'react';
import { Switch } from 'react-native';
import RNPermissions, { request } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

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
                <PageTitle>
                    {translate('View_Permissions_AppleAT_PageTitle')}
                </PageTitle>
                <Message>
                    {translate('View_Permissions_AppleAT_Message')}
                </Message>

                <SettingContainer>
                    <SettingTitle>
                        {translate(
                            'View_Permissions_AppleAT_SwitchAllowTracking'
                        )}
                    </SettingTitle>
                    <Switch value={deviceId} onValueChange={onDeviceIdChange} />
                </SettingContainer>

                <Button
                    text={translate('View_Permissions_AppleAT_Button_Continue')}
                    onPress={handleContinue}
                />
            </Content>
        </Container>
    );
};

export default AppleATT;
