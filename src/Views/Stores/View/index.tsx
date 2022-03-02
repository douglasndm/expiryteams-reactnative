import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { exportToExcel } from '~/Functions/Excel';
import { getAllProductsFromStore } from '~/Functions/Team/Stores/Products';

import Header from '~/Components/Header';
import Loading from '~/Components/Loading';
import ListProducts from '~/Components/ListProducts';

import {
    FloatButton,
    Icons as FloatIcon,
} from '~/Components/ListProducts/styles';

import {
    Container,
    ItemTitle,
    ActionsContainer,
    ActionButtonsContainer,
    Icons,
    TitleContainer,
    ActionText,
} from '~/Styles/Views/GenericViewPage';

interface Props {
    store_id: string;
    store_name: string;
}

const StoreView: React.FC = () => {
    const { params } = useRoute();
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const teamContext = useTeam();

    const routeParams = params as Props;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [storeName] = useState<string>(() => routeParams.store_name);

    const [products, setProducts] = useState<IProduct[]>([]);

    const loadData = useCallback(async () => {
        if (!teamContext.id) return;
        try {
            setIsLoading(true);

            const response = await getAllProductsFromStore({
                team_id: teamContext.id,
                store_id: routeParams.store_id,
            });

            setProducts(response);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.store_id, teamContext.id]);

    const handleEdit = useCallback(() => {
        navigate('StoreEdit', { store_id: routeParams.store_id });
    }, [navigate, routeParams.store_id]);

    const handleGenereteExcel = useCallback(async () => {
        try {
            setIsLoading(true);

            // await exportToExcel({
            //    sortBy: 'expire_date',
            //    brand: routeParams.brand_id,
            // });

            if (!__DEV__)
                Analytics().logEvent('Exported_To_Excel_From_StoreView');

            showMessage({
                message: strings.View_Brand_View_SuccessExportExcel,
                type: 'info',
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct', { store: routeParams.store_id });
    }, [navigate, routeParams.store_id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title="Loja" noDrawer />

            <TitleContainer>
                <ItemTitle>{storeName}</ItemTitle>

                <ActionsContainer>
                    {/*
                    <ActionButtonsContainer onPress={handleEdit}>
                        <ActionText>
                            {strings.View_ProductDetails_Button_UpdateProduct}
                        </ActionText>
                        <Icons name="create-outline" size={22} />
                    </ActionButtonsContainer>

                    <ActionButtonsContainer onPress={handleGenereteExcel}>
                        <ActionText>Gerar Excel</ActionText>
                        <Icons name="stats-chart-outline" size={22} />
                    </ActionButtonsContainer>
                    */}
                </ActionsContainer>
            </TitleContainer>

            <ListProducts products={products} deactiveFloatButton />

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

export default StoreView;
