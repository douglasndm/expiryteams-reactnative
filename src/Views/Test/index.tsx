import React, { useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import FlashMessage, {
    showMessage,
    hideMessage,
} from 'react-native-flash-message';

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
                </Category>
            </ScrollView>

            <FlashMessage position="top" />
        </Container>
    );
};

export default Test;
