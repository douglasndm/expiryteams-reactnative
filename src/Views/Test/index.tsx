import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import OneSignal from 'react-native-onesignal';

import Button from '../../Components/Button';

import { Container, Category } from '../Settings/styles';
import { deleteSubscription } from '~/Functions/Team/Subscriptions/Delete';
import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

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

    const deleteSub = useCallback(async () => {
        const team = await getSelectedTeam();

        if (!team) return;
        await deleteSubscription(team.userRole.team.id);
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

                    <Button text="Delete subscription" onPress={deleteSub} />
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
