import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { getAllProductsByStore, getStore } from '~/Functions/Stores';
import {
    sortProductsByFisrtLoteExpDate,
    sortProductsLotesByLotesExpDate,
} from '~/Functions/Products';

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

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            let results: Array<IProduct> = [];

            if (store === '000') {
                setStoreName(translate('View_AllProductByStore_NoStore'));
                results = await getAllProductsByStore(null);
            } else {
                results = await getAllProductsByStore(store);

                const s = await getStore(store);

                if (s) {
                    setStoreName(s.name);
                } else {
                    setStoreName(store);
                }
            }

            // ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
            const sortedProds = sortProductsLotesByLotesExpDate(results);

            // DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
            // CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
            // DE QUAL ESTÁ MAIS PRÓXIMO
            const sortedProductsFinal = sortProductsByFisrtLoteExpDate(
                sortedProds
            );

            setProducts(sortedProductsFinal);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [store]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
