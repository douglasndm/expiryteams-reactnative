import React, { useCallback, useContext } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../Locales';

import PreferencesContext from '../../Contexts/PreferencesContext';

import ProductItem from '../ProductItem';
import GenericButton from '../Button';

import {
    Container,
    ProBanner,
    ProText,
    CategoryDetails,
    CategoryDetailsText,
    EmptyListText,
} from './styles';

interface RequestProps {
    products: Array<IProduct>;
    isHome?: boolean;
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    isHome,
}: RequestProps) => {
    const { navigate } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const handleNavigateToAllProducts = useCallback(() => {
        navigate('AllProducts');
    }, [navigate]);

    const handleNavigateAddNewProduct = useCallback(() => {
        navigate('AddProduct');
    }, [navigate]);

    const handleNavigateProPage = useCallback(() => {
        navigate('PremiumSubscription');
    }, [navigate]);

    const ListHeader = useCallback(() => {
        return (
            <View>
                {userPreferences.isUserPremium !== true && (
                    <ProBanner onPress={handleNavigateProPage}>
                        <ProText>
                            {translate(
                                'ListProductsComponent_PROBanner_message'
                            )}
                        </ProText>
                    </ProBanner>
                )}

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
    }, [products, handleNavigateProPage, userPreferences.isUserPremium]);

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
                />
            );
        }

        return (
            <GenericButton
                text={translate('ListProductsComponent_Button_AddNewProduct')}
                onPress={handleNavigateAddNewProduct}
            />
        );
    }, [
        products.length,
        isHome,
        handleNavigateAddNewProduct,
        handleNavigateToAllProducts,
    ]);

    const renderComponent = useCallback(({ item, index }) => {
        return <ProductItem product={item} index={index} />;
    }, []);

    return (
        <Container>
            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={renderComponent}
                ListEmptyComponent={EmptyList}
                ListFooterComponent={FooterButton}
                initialNumToRender={10}
                removeClippedSubviews
            />
        </Container>
    );
};

export default ListProducts;
