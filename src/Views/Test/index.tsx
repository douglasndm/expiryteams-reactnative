import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

import messaging from '@react-native-firebase/messaging';

import Button from '../../Components/Button';

import { Container, Category } from '../Settings/styles';
import { getOfferings } from '~/Functions/Team/Subscriptions';

const Test: React.FC = () => {
    interface IProductImage {
        productId: number;
        imagePath: string;
        imageName: string;
    }

    const [text, setText] = useState<string>('');

    useEffect(() => {
        messaging()
            .getToken()
            .then(response => console.log(response));
    }, []);

    const handleToken = useCallback(async () => {
        const token = await auth().currentUser?.getIdTokenResult();

        console.log(token);
    }, []);

    const handleOfferings = useCallback(async () => {
        const response = await getOfferings();

        setText(String(response));
    }, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button text="Log user token" onPress={handleToken} />

                    <Button
                        text="Display offerings"
                        onPress={handleOfferings}
                    />

                    <Text>{text}</Text>
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
