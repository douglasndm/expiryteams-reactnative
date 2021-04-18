import React, { useCallback } from 'react';
import RNPermissions, { request } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { setAllowedToReadIDFA } from '~/Functions/Privacy';

import Button from '~/Components/Button';

import { Container, Content, PageTitle, Message } from './styles';

const AppleATT: React.FC = () => {
    const { reset } = useNavigation();

    const handleContinue = useCallback(async () => {
        let response = null;

        response = await request(
            RNPermissions.PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
        );

        if (response === 'granted') {
            await setAllowedToReadIDFA(true);
        } else {
            await setAllowedToReadIDFA(false);
        }

        reset({
            routes: [{ name: 'Home' }],
        });
    }, [reset]);

    return (
        <Container>
            <Content>
                <PageTitle>
                    {translate('View_Permissions_AppleAT_PageTitle')}
                </PageTitle>
                <Message>
                    {translate('View_Permissions_AppleAT_Message')}
                </Message>

                <Button
                    text={translate('View_Permissions_AppleAT_Button_Continue')}
                    onPress={handleContinue}
                />
            </Content>
        </Container>
    );
};

export default AppleATT;
