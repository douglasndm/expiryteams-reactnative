import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import Button from '~/Components/Button';

import { Category, CategoryOptions, CategoryTitle } from '../../styles';
// import { Container } from './styles';

const Account: React.FC = () => {
    const { navigate } = useNavigation();

    const handleLogout = useCallback(async () => {
        navigate('Logout');
    }, [navigate]);

    return (
        <Category>
            <CategoryTitle>Conta</CategoryTitle>

            <CategoryOptions>
                <Button text="Sair" onPress={handleLogout} />
            </CategoryOptions>
        </Category>
    );
};

export default Account;
