import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Analytics from '@react-native-firebase/analytics';

import Header from '@components/Header';
import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllProductsFromCategory } from '~/Functions/Categories/Products';

import Loading from '@components/Loading';
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
} from '@styles/Views/GenericViewPage';
import { exportToExcel } from '~/Functions/Excel';

interface Props {
	category_id: string;
	category_name?: string;
}

const CategoryView: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

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
		if (!teamContext.id) return;
		try {
			setIsLoading(true);

			const prods = await getAllProductsFromCategory({
				team_id: teamContext.id,
				category_id: routeParams.category_id,
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
	}, [routeParams.category_id, teamContext.id]);

	const handleEdit = useCallback(() => {
		navigate('CategoryEdit', { id: routeParams.category_id });
	}, [navigate, routeParams.category_id]);

	const handleNavigateAddProduct = useCallback(() => {
		navigate('AddProduct', { category: routeParams.category_id });
	}, [navigate, routeParams.category_id]);

	const handleExportExcel = useCallback(async () => {
		try {
			setIsLoading(true);

			await exportToExcel({
				sortBy: 'expire_date',
				category: routeParams.category_id,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_CategoryView');

			showMessage({
				message: strings.View_Category_View_ExcelExportedSuccess,
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
	}, [routeParams.category_id]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_Category_List_View_BeforeCategoryName}
				noDrawer
			/>

			<TitleContainer>
				<ItemTitle>{categoryName}</ItemTitle>

				<ActionsContainer>
					{!!teamContext.roleInTeam &&
						teamContext.roleInTeam.role.toLowerCase() ===
							'manager' && (
							<ActionButtonsContainer onPress={handleEdit}>
								<ActionText>
									{
										strings.View_ProductDetails_Button_UpdateProduct
									}
								</ActionText>
								<Icons name="create-outline" size={22} />
							</ActionButtonsContainer>
						)}

					<ActionButtonsContainer onPress={handleExportExcel}>
						<ActionText>Gerar Excel</ActionText>
						<Icons name="stats-chart-outline" size={22} />
					</ActionButtonsContainer>
				</ActionsContainer>
			</TitleContainer>

			<ListProducts
				products={products}
				deactiveFloatButton
				onRefresh={loadData}
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
