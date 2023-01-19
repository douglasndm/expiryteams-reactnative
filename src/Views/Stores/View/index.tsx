import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { exportToExcel } from '@utils/Excel/Export';
import { getAllProductsFromStore } from '@teams/Functions/Team/Stores/Products';

import Header from '@components/Header';
import Loading from '@components/Loading';

import ListProducts from '@teams/Components/ListProducts';

import {
	FloatButton,
	Icons as FloatIcon,
} from '@teams/Components/ListProducts/styles';

import {
	Container,
	ItemTitle,
	ActionsContainer,
	ActionButtonsContainer,
	Icons,
	TitleContainer,
	ActionText,
} from '@styles/Views/GenericViewPage';
import { getAllProducts } from '@teams/Functions/Products/Products';
import { getAllBrands } from '@teams/Functions/Brand';
import { getAllCategoriesFromTeam } from '@teams/Functions/Categories';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';

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

			const getProducts = async () =>
				getAllProducts({
					team_id: teamContext.id || '',
					removeCheckedBatches: false,
				});
			const getBrands = async () =>
				getAllBrands({ team_id: teamContext.id || '' });
			const getCategories = async () =>
				getAllCategoriesFromTeam({ team_id: teamContext.id || '' });
			const getStores = async () =>
				getAllStoresFromTeam({ team_id: teamContext.id || '' });

			await exportToExcel({
				sortBy: 'expire_date',
				store: routeParams.store_id,
				getProducts,
				getBrands,
				getCategories,
				getStores,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_StoreView');

			showMessage({
				message: strings.View_Brand_View_SuccessExportExcel,
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error)
				if (!err.message.includes('did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});
				}
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.store_id, teamContext.id]);

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
				</ActionsContainer>
			</TitleContainer>

			<ListProducts
				products={products}
				onRefresh={loadData}
				deactiveFloatButton
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

export default StoreView;
