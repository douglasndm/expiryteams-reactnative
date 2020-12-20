import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native';

import { translate } from '../../Locales';

import { GetAllProductsOrderedByStore } from '../../Functions/StoresGroup';

import Loading from '../../Components/Loading';
import StoreGroup from '../../Components/StoreGroup';
import Header from '../../Components/Header';

import { Container } from './styles';

const AllProductsByStore: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [allProducts, setAllProducsts] = useState<IStoreGroup[]>([]);

    const loadData = useCallback(async () => {
        setIsLoading(true);

        const response = await GetAllProductsOrderedByStore({ limit: 5 });
        setAllProducsts(response);

        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <ScrollView>
                <Header
                    title={translate('View_AllProductsByStore_PageTitle')}
                />
                {allProducts.map((storeGroup) => (
                    <StoreGroup
                        key={storeGroup.name}
                        storeName={storeGroup.name}
                        products={storeGroup.products}
                    />
                ))}
            </ScrollView>
        </Container>
    );
};

export default AllProductsByStore;
