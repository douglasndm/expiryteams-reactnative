import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';
import Notification from '~/Components/Notification';
import {
    FloatButton,
    Icons as FloatIcon,
} from '~/Components/ListProducts/styles';

import { Container, StoreTitle } from './styles';

interface RequestProps {
    route: {
        params: {
            store: string; // can be the name too
        };
    };
}

const StoreDetails: React.FC<RequestProps> = ({ route }: RequestProps) => {
    const { navigate } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [storeName, setStoreName] = useState<string>('');
    const [products, setProducts] = useState<IProduct[]>([]);

    const { store } = route.params;

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct', { store });
    }, [navigate, store]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header />

            <StoreTitle>
                {translate('View_AllProductByStore_StoreName').replace(
                    '{STORE}',
                    storeName
                )}
            </StoreTitle>

            <ListProducts products={products} deactiveFloatButton />

            <FloatButton
                icon={() => (
                    <FloatIcon name="add-outline" color="white" size={22} />
                )}
                small
                label={translate('View_FloatMenu_AddProduct')}
                onPress={handleNavigateAddProduct}
            />

            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </Container>
    );
};

export default StoreDetails;
