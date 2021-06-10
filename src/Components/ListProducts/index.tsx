import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../Locales';

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
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    onRefresh,
    deactiveFloatButton,
}: RequestProps) => {
    const { navigate } = useNavigation();

    const [refreshing, setRefreshing] = React.useState<boolean>(false);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct');
    }, [navigate]);

    const ListHeader = useCallback(() => {
        return (
            <View>
                {/* Verificar se há items antes de criar o titulo */}
                {products.length > 0 && (
                    <CategoryDetails>
                        <CategoryDetailsText>
                            {translate(
                                'ListProductsComponent_Title_ProductsNextToExp'
                            )}
                        </CategoryDetailsText>
                    </CategoryDetails>
                )}
            </View>
        );
    }, [products]);

    const EmptyList = useCallback(() => {
        return (
            <EmptyListText>
                {translate('ListProductsComponent_Title_NoProductsInList')}
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
                data={products}
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
                    label={translate('View_FloatMenu_AddProduct')}
                    onPress={handleNavigateAddProduct}
                />
            )}
        </Container>
    );
};

export default ListProducts;
