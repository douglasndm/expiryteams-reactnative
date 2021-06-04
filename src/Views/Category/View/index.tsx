import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getAllProductsFromCategory } from '~/Functions/Categories/Products';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';

import {
    FloatButton,
    Icons as FloatIcon,
} from '~/Components/ListProducts/styles';

import {
    Container,
    CategoryTitle,
    ActionsButtonContainer,
    ActionButton,
    Icons,
} from './styles';

interface Props {
    id: string;
}

const CategoryView: React.FC = () => {
    const { params } = useRoute();
    const { navigate } = useNavigation();

    const { preferences } = useContext(PreferencesContext);

    const routeParams = params as Props;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [categoryName, setCategoryName] = useState<string>('');

    const [products, setProducts] = useState<IProduct[]>([]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const prods = await getAllProductsFromCategory({
                category_id: routeParams.id,
            });

            if ('error' in prods) {
                showMessage({
                    message: prods.error,
                    type: 'danger',
                });
                return;
            }

            setCategoryName(prods.category);
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
    }, [routeParams.id]);

    const handleEdit = useCallback(() => {
        navigate('CategoryEdit', { id: routeParams.id });
    }, [navigate, routeParams.id]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct', { category: routeParams.id });
    }, [navigate, routeParams.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header />

            <CategoryTitle>
                {translate('View_Category_List_View_BeforeCategoryName')}
                {categoryName}
            </CategoryTitle>

            {preferences.selectedTeam.role.toLowerCase() === 'manager' && (
                <ActionsButtonContainer>
                    <ActionButton
                        icon={() => <Icons name="create-outline" size={22} />}
                        onPress={handleEdit}
                    >
                        {translate('View_ProductDetails_Button_UpdateProduct')}
                    </ActionButton>
                </ActionsButtonContainer>
            )}

            <ListProducts products={products} deactiveFloatButton />

            <FloatButton
                icon={() => (
                    <FloatIcon name="add-outline" color="white" size={22} />
                )}
                small
                label={translate('View_FloatMenu_AddProduct')}
                onPress={handleNavigateAddProduct}
            />

            <FlashMessage position="top" />
        </Container>
    );
};

export default CategoryView;
