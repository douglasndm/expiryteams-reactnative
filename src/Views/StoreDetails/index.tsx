import React, { useCallback, useEffect, useState } from 'react';

import { translate } from '../../Locales';

import {
    getAllProductsByStore,
    getAllProductsWithoutStore,
} from '../../Functions/Store';

import Loading from '../../Components/Loading';
import Header from '../../Components/Header';
import ListProducts from '../../Components/ListProducts';
import Notification from '../../Components/Notification';

import { Container, StoreTitle } from './styles';

interface RequestProps {
    route: {
        params: {
            storeName: string;
        };
    };
}

const StoreDetails: React.FC<RequestProps> = ({ route }: RequestProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [products, setProducts] = useState<IProduct[]>([]);

    const { storeName } = route.params;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            let results: Array<IProduct> = [];

            if (storeName === 'Sem loja') {
                results = await getAllProductsWithoutStore();
            } else {
                results = await getAllProductsByStore({ store: storeName });
            }

            setProducts(results);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [storeName]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header />

            <StoreTitle>
                {translate('View_AllProductByStore_BeforeStoreName')}{' '}
                {storeName === 'Sem loja'
                    ? translate('View_AllProductByStore_NoStore')
                    : storeName}
            </StoreTitle>

            <ListProducts products={products} />

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
