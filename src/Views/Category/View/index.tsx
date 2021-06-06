import React, {
    useCallback,
    useEffect,
    useState,
    useContext,
    useMemo,
} from 'react';
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
    category_id: string;
    category_name?: string;
}

const CategoryView: React.FC = () => {
    const { params } = useRoute();
    const { navigate } = useNavigation();

    const { preferences } = useContext(PreferencesContext);

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
            <Header title="Produtos na categoria" />

            <CategoryTitle>{categoryName}</CategoryTitle>

            {!!preferences.selectedTeam &&
                preferences.selectedTeam.role.toLowerCase() === 'manager' && (
                    <ActionsButtonContainer>
                        <ActionButton
                            icon={() => (
                                <Icons name="create-outline" size={22} />
                            )}
                            onPress={handleEdit}
                        >
                            {translate(
                                'View_ProductDetails_Button_UpdateProduct'
                            )}
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
