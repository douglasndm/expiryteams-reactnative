import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { exportToExcel } from '@utils/Excel/Export';
import { searchProducts } from '@utils/Product/Search';

import { getAllBrands, getAllProductsByBrand } from '@teams/Functions/Brand';

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
import { getAllCategoriesFromTeam } from '@teams/Functions/Categories';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';

interface Props {
	brand_id: string;
	brand_name: string;
}

const View: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation();

	const teamContext = useTeam();

	const routeParams = params as Props;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	const [brandName] = useState<string>(() => routeParams.brand_name);

	const [products, setProducts] = useState<IProduct[]>([]);

	const canEdit = useMemo(() => {
		if (teamContext.roleInTeam) {
			const { role } = teamContext.roleInTeam;

			if (role.toLowerCase() === 'manager') return true;

			if (role.toLowerCase() === 'supervisor') return true;
		}

		return false;
	}, [teamContext.roleInTeam]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			setIsLoading(true);

			const prods = await getAllProductsByBrand({
				team_id: teamContext.id,
				brand_id: routeParams.brand_id,
			});

			setProducts(prods);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.brand_id, teamContext.id]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleEdit = useCallback(() => {
		navigate('BrandEdit', { brand_id: routeParams.brand_id });
	}, [navigate, routeParams.brand_id]);

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
				brand: routeParams.brand_id,
				getProducts,
				getBrands,
				getCategories,
				getStores,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_BrandView');

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
	}, [routeParams.brand_id, teamContext.id]);

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

	return (
		<Container>
			<Header
				title={strings.View_Brand_View_PageTitle}
				searchValue={searchQuery}
				onSearchChange={handleSearchChange}
				handleSearch={handleSearch}
				exportToExcel={handleExportExcel}
				navigateToEdit={canEdit ? handleEdit : undefined}
				isLoading={isLoading}
			/>

			<TitleContainer>
				<ItemTitle>{brandName}</ItemTitle>
			</TitleContainer>

			{isLoading ? (
				<Loading />
			) : (
				<>
					<ListProducts
						products={productsSearch}
						onRefresh={loadData}
					/>

					<FloatButton
						navigateTo="AddProduct"
						brandId={routeParams.brand_id}
					/>
				</>
			)}
		</Container>
	);
};

export default View;
