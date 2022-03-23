import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import OneSignal from 'react-native-onesignal';

import Sentry from '~/Services/Sentry';

import Button from '../../Components/Button';

import { Container, Category } from '../Settings/styles';

const Test: React.FC = () => {
    const handleMessaingToken = useCallback(async () => {
        const token = await messaging().getToken();

        console.log(token);
    }, []);

    const handleToken = useCallback(async () => {
        const token = await auth().currentUser?.getIdTokenResult();

        const oneSignal = await OneSignal.getDeviceState();

        console.log(oneSignal);

        console.log(token?.token);
    }, []);

    const handleCrash = useCallback(() => {
        Sentry.nativeCrash();
    }, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button
                        text="Log Messaing token"
                        onPress={handleMessaingToken}
                    />
                    <Button text="Log user token" onPress={handleToken} />

                    <Button text="Native crash" onPress={handleCrash} />
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
