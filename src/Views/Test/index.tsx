import React, { useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const handleDeletePrivacySetting = useCallback(async () => {
        await AsyncStorage.removeItem('Privacy/canUseIDFA');
    }, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button
                        text="Delete privacy setting"
                        onPress={handleDeletePrivacySetting}
                    />
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
