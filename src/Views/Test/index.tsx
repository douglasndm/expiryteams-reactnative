import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';

import messaging from '@react-native-firebase/messaging';

import Button from '../../Components/Button';

import { Container, Category } from '../Settings/styles';

const Test: React.FC = () => {
    const handleMessaingToken = useCallback(async () => {
        const token = await messaging().getToken();

        console.log(token);
    }, []);

    const handleToken = useCallback(async () => {
        const token = await auth().currentUser?.getIdTokenResult();

        console.log(token?.token);
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
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
