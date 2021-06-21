import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllProductsFromCategory } from '~/Functions/Categories/Products';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';

import {
    FloatButton,
    Icons as FloatIcon,
} from '~/Components/ListProducts/styles';

import {
    Container,
    ActionsButtonContainer,
    ActionButton,
    Icons,
} from './styles';

interface Props {
    category_id: string;
    category_name?: string;
}

const CategoryView: React.FC = () => {
    const { params } = useRoute();
    const { navigate } = useNavigation();

    const teamContext = useTeam();

    const routeParams = params as Props;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const categoryName = useMemo(() => {
        if (routeParams.category_name) {
            return routeParams.category_name;
        }
        return '';
    }, [routeParams.category_name]);

    const [products, setProducts] = useState<IProduct[]>([]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const prods = await getAllProductsFromCategory({
                category_id: routeParams.category_id,
            });

            setProducts(prods.products);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.category_id]);

    const handleEdit = useCallback(() => {
        navigate('CategoryEdit', { id: routeParams.category_id });
    }, [navigate, routeParams.category_id]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct', { category: routeParams.category_id });
    }, [navigate, routeParams.category_id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title={categoryName} />

            {!!teamContext.roleInTeam &&
                teamContext.roleInTeam.role.toLowerCase() === 'manager' && (
                    <ActionsButtonContainer>
                        <ActionButton
                            icon={() => (
                                <Icons name="create-outline" size={22} />
                            )}
                            onPress={handleEdit}
                        >
                            {strings.View_ProductDetails_Button_UpdateProduct}
                        </ActionButton>
                    </ActionsButtonContainer>
                )}

            <ListProducts
                products={products}
                deactiveFloatButton
                removeProdsWithoutBatches
                sortProdsByBatchExpDate
            />

            <FloatButton
                icon={() => (
                    <FloatIcon name="add-outline" color="white" size={22} />
                )}
                small
                label={strings.View_FloatMenu_AddProduct}
                onPress={handleNavigateAddProduct}
            />
        </Container>
    );
};

export default CategoryView;
