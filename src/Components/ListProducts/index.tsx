import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../Locales';

import ProductItem from './ProductContainer';
import GenericButton from '../Button';

import {
    Container,
    CategoryDetails,
    CategoryDetailsText,
    EmptyListText,
    InvisibleComponent,
    FloatButton,
    Icons,
} from './styles';

interface RequestProps {
    products: Array<IProduct>;
    isHome?: boolean;
    deactiveFloatButton?: boolean;
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    isHome,
    deactiveFloatButton,
}: RequestProps) => {
    const { navigate } = useNavigation();

    const handleNavigateToAllProducts = useCallback(() => {
        navigate('AllProducts');
    }, [navigate]);

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
        if (products.length > 5 && isHome) {
            return (
                <GenericButton
                    text={translate(
                        'ListProductsComponent_Button_ShowAllProducts'
                    )}
                    onPress={handleNavigateToAllProducts}
                    contentStyle={{ marginBottom: 100 }}
                />
            );
        }

        return <InvisibleComponent />;
    }, [products.length, isHome, handleNavigateToAllProducts]);

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
                ListFooterComponent={FooterButton}
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
