import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import Button from '~/Components/Button';

import { Category, CategoryOptions, CategoryTitle } from '../../styles';

const Account: React.FC = () => {
    const { navigate } = useNavigation();

    const handleLogout = useCallback(() => {
        navigate('Logout');
    }, [navigate]);

    const handleNavigateDelete = useCallback(() => {
        navigate('DeleteUser');
    }, [navigate]);

    return (
        <Category>
            <CategoryTitle>Conta</CategoryTitle>

            <CategoryOptions>
                <Button
                    text="Sair"
                    onPress={handleLogout}
                    contentStyle={{ width: 135 }}
                />

                <Button
                    text="Apagar conta"
                    onPress={handleNavigateDelete}
                    contentStyle={{
                        width: 135,
                        marginTop: 0,
                        backgroundColor: '#b00c17',
                    }}
                />
            </CategoryOptions>
        </Category>
    );
};

export default Account;
