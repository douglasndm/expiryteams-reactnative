import React, { useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import FlashMessage, {
    showMessage,
    hideMessage,
} from 'react-native-flash-message';
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

    const handleLogin = useCallback(async () => {
        auth()
            .createUserWithEmailAndPassword(
                'jane.doe@example.com',
                'SuperSecretPassword!'
            )
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }, []);

    useEffect(() => {
        messaging()
            .getToken()
            .then(response => console.log(response));
    }, []);

    const handleShowAlert = useCallback(() => {
        showMessage({
            message: 'Hello',
        });
    }, []);

    const handleHideAlert = useCallback(() => {
        hideMessage();
    }, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button text="Show alert" onPress={handleShowAlert} />

                    <Button text="Hide alert" onPress={handleHideAlert} />

                    <Button text="Try login" onPress={handleLogin} />
                </Category>
            </ScrollView>

            <FlashMessage position="top" />
        </Container>
    );
};

export default Test;
