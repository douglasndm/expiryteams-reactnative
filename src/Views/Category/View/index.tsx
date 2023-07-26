import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Analytics from '@react-native-firebase/analytics';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { exportToExcel } from '@utils/Excel/Export';
import { searchProducts } from '@utils/Product/Search';

import { getAllProducts } from '@teams/Functions/Products/Products';
import { getAllProductsFromCategory } from '@teams/Functions/Categories/Products';
import { getAllCategoriesFromTeam } from '@teams/Functions/Categories';
import { getAllBrands } from '@teams/Functions/Brand';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';

import Loading from '@components/Loading';
import Header from '@components/Products/List/Header';
import FloatButton from '@components/FloatButton';

import ListProducts from '@teams/Components/ListProducts';

import {
	Container,
	ItemTitle,
	TitleContainer,
} from '@styles/Views/GenericViewPage';

interface Props {
	id: string;
	category_name?: string;
}

const CategoryView: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const routeParams = params as Props;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	const categoryName = useMemo(() => {
		if (routeParams.category_name) {
			return routeParams.category_name;
		}
		return '';
	}, [routeParams.category_name]);

	const isManager = useMemo(() => {
		if (
			!!teamContext.roleInTeam &&
			teamContext.roleInTeam.role.toLowerCase() === 'manager'
		) {
			return true;
		}
		return false;
	}, [teamContext.roleInTeam]);

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			setIsLoading(true);

			const prods = await getAllProductsFromCategory({
				team_id: teamContext.id,
				category_id: routeParams.id,
			});

			setProducts(prods.products);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.id, teamContext.id]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleEdit = useCallback(() => {
		navigate('CategoryEdit', { id: routeParams.id });
	}, [navigate, routeParams.id]);

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
				category: routeParams.id,
				getProducts,
				getBrands,
				getCategories,
				getStores,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_CategoryView');

			showMessage({
				message: strings.View_Category_View_ExcelExportedSuccess,
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
	}, [routeParams.id, teamContext.id]);

	useEffect(() => {
		loadData();
	}, [loadData]);

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

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_Category_List_View_BeforeCategoryName}
				searchValue={searchQuery}
				onSearchChange={handleSearchChange}
				handleSearch={handleSearch}
				exportToExcel={handleExportExcel}
				navigateToEdit={isManager ? handleEdit : undefined}
			/>

			<TitleContainer>
				<ItemTitle>{categoryName}</ItemTitle>
			</TitleContainer>

			<ListProducts products={productsSearch} onRefresh={loadData} />

			<FloatButton navigateTo="AddProduct" categoryId={routeParams.id} />
		</Container>
	);
};

export default CategoryView;
