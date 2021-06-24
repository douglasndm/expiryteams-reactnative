import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import strings from '~/Locales';

import {
    removeProductsWithCheckedBatches,
    sortProductsByBatchesExpDate,
} from '~/Functions/Products/Products';
import {
    sortBatches,
    removeCheckedBatches,
} from '~/Functions/Products/Batches';

import ProductItem from './ProductContainer';

import {
    Container,
    CategoryDetails,
    CategoryDetailsText,
    EmptyListText,
    FloatButton,
    Icons,
    InvisibleComponent,
} from './styles';

interface RequestProps {
    products: Array<IProduct>;
    onRefresh?: () => void;
    deactiveFloatButton?: boolean;
    removeProdsWithoutBatches?: boolean;
    sortProdsByBatchExpDate?: boolean;
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    onRefresh,
    deactiveFloatButton,
    removeProdsWithoutBatches,
    sortProdsByBatchExpDate,
}: RequestProps) => {
    const { navigate } = useNavigation();

    const [refreshing, setRefreshing] = React.useState<boolean>(false);

    const [prods, setProds] = useState<Array<IProduct>>([]);

    const sortProducts = useMemo(() => sortProdsByBatchExpDate, [
        sortProdsByBatchExpDate,
    ]);

    useEffect(() => {
        if (products) {
            if (sortProducts === true) {
                if (sortProducts === true) {
                    const sortedProducts = sortProductsByBatchesExpDate({
                        products,
                    });

                    setProds(sortedProducts);
                    return;
                }
            }

            setProds(products);
        }
    }, [products, sortProducts]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct');
    }, [navigate]);

    const ListHeader = useCallback(() => {
        return (
            <View>
                {/* Verificar se há items antes de criar o titulo */}
                {prods.length > 0 && (
                    <CategoryDetails>
                        <CategoryDetailsText>
                            {
                                strings.ListProductsComponent_Title_ProductsNextToExp
                            }
                        </CategoryDetailsText>
                    </CategoryDetails>
                )}
            </View>
        );
    }, [prods]);

    const EmptyList = useCallback(() => {
        return (
            <EmptyListText>
                {strings.ListProductsComponent_Title_NoProductsInList}
            </EmptyListText>
        );
    }, []);

    const FooterButton = useCallback(() => {
        return <InvisibleComponent />;
    }, []);

    const renderComponent = useCallback(({ item }) => {
        const product: IProduct = item as IProduct;
        product.batches = sortBatches(product.batches);
        product.batches = removeCheckedBatches(product.batches);

        return <ProductItem product={product} />;
    }, []);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        if (onRefresh) {
            onRefresh();
        }
        setRefreshing(false);
    }, [onRefresh]);

    return (
        <Container>
            <FlatList
                data={prods}
                keyExtractor={item => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={renderComponent}
                ListEmptyComponent={EmptyList}
                initialNumToRender={10}
                ListFooterComponent={FooterButton}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />

            {!deactiveFloatButton && (
                <FloatButton
                    icon={() => (
                        <Icons name="add-outline" color="white" size={22} />
                    )}
                    small
                    label={strings.View_FloatMenu_AddProduct}
                    onPress={handleNavigateAddProduct}
                />
            )}
        </Container>
    );
};

export default ListProducts;
