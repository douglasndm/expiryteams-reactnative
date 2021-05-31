import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../Locales';

import ProductItem from './ProductContainer';

import {
    Container,
    CategoryDetails,
    CategoryDetailsText,
    EmptyListText,
    FloatButton,
    Icons,
} from './styles';

interface RequestProps {
    products: Array<IProduct>;
    deactiveFloatButton?: boolean;
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    deactiveFloatButton,
}: RequestProps) => {
    const { navigate } = useNavigation();

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

    const renderComponent = useCallback(({ item, index }) => {
        return <ProductItem product={item} index={index} />;
    }, []);

    return (
        <Container>
            <FlatList
                data={products}
                keyExtractor={item => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={renderComponent}
                ListEmptyComponent={EmptyList}
                initialNumToRender={10}
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
