import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { exportToExcel } from '@utils/Excel/Export';
import { searchProducts } from '@utils/Product/Search';

import { getAllProductsFromStore } from '@teams/Functions/Team/Stores/Products';

import Loading from '@components/Loading';
import Header from '@components/Products/List/Header';
import FloatButton from '@components/FloatButton';

import ListProducts from '@teams/Components/ListProducts';

import {
	Container,
	ItemTitle,
	TitleContainer,
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

	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [searchQuery, setSearchQuery] = React.useState('');

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

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleEdit = useCallback(() => {
		navigate('StoreEdit', { store_id: routeParams.store_id });
	}, [navigate, routeParams.store_id]);

	const handleExportExcel = useCallback(async () => {
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

	const handleSearchChange = useCallback(
		async (search: string) => {
			setSearchQuery(search);

			if (search.trim() === '') {
				setProductsSearch(products);
			}
		},
		[products]
	);

	const handleSearch = useCallback(
		(value?: string) => {
			const query = value && value.trim() !== '' ? value : searchQuery;

			let prods: IProduct[] = [];

			if (query && query !== '') {
				prods = searchProducts({
					products,
					query,
				});
			}

			setProductsSearch(prods);
		},
		[products, searchQuery]
	);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title="Loja"
				searchValue={searchQuery}
				onSearchChange={handleSearchChange}
				handleSearch={handleSearch}
				exportToExcel={handleExportExcel}
				navigateToEdit={handleEdit}
			/>

			<TitleContainer>
				<ItemTitle>{storeName}</ItemTitle>
			</TitleContainer>

			<ListProducts products={productsSearch} onRefresh={loadData} />

			<FloatButton
				navigateTo="AddProduct"
				storeId={routeParams.store_id}
			/>
		</Container>
	);
};

export default StoreView;
