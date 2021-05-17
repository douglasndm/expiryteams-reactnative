import React, { useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';

import messaging from '@react-native-firebase/messaging';

import Button from '../../Components/Button';

import { Container, Category } from '../Settings/styles';

const Test: React.FC = () => {
    interface IProductImage {
        productId: number;
        imagePath: string;
        imageName: string;
    }

    useEffect(() => {
        messaging()
            .getToken()
            .then(response => console.log(response));
    }, []);

    const handleToken = useCallback(async () => {
        const token = await auth().currentUser?.getIdTokenResult();

        console.log(token);
    }, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button text="Log user token" onPress={handleToken} />
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
