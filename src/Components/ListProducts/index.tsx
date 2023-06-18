import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { sortBatches, removeCheckedBatches } from '@utils/Product/Batches';
import {
	deleteManyProducts,
	sortProductsByBatchesExpDate,
} from '@teams/Functions/Products/Products';

import Dialog from '@components/Dialog';
import ActionButtons from '@components/Product/List/ActionButtons';

import ProductItem from './ProductContainer';

import {
	Container,
	CategoryDetails,
	CategoryDetailsText,
	EmptyListText,
	FloatButton,
	Icons,
	InvisibleComponent,
	ProductContainer,
	SelectButtonContainer,
	SelectButton,
	SelectIcon,
} from './styles';

interface RequestProps {
	products: Array<IProduct>;
	onRefresh?: () => void;
	deactiveFloatButton?: boolean;
	sortProdsByBatchExpDate?: boolean;
	listRef?: React.RefObject<FlatList<IProduct>>;
}

const ListProducts: React.FC<RequestProps> = ({
	products,
	onRefresh,
	deactiveFloatButton,
	sortProdsByBatchExpDate,
	listRef,
}: RequestProps) => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [refreshing, setRefreshing] = React.useState<boolean>(false);

	const [prods, setProds] = useState<Array<IProduct>>([]);
	const [selectedProds, setSelectedProds] = useState<Array<string>>([]);
	const [selectMode, setSelectMode] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const isAdmin = useMemo(() => {
		const role = teamContext.roleInTeam?.role.toLowerCase();
		if (role === 'manager' || role === 'supervisor') {
			return true;
		}
		return false;
	}, [teamContext.roleInTeam]);

	const sortProducts = useMemo(
		() => sortProdsByBatchExpDate,
		[sortProdsByBatchExpDate]
	);

	useEffect(() => {
		if (products) {
			if (sortProducts === true) {
				if (sortProducts === true) {
					const sortedProducts = sortProductsByBatchesExpDate({
						products,
					});

					setProds(sortedProducts);
					return;
				}
			}

			setProds(products);
		}
	}, [products, sortProducts]);

	const handleNavigateAddProduct = useCallback(() => {
		navigate('AddProduct', {});
	}, [navigate]);

	const ListHeader = useCallback(() => {
		return (
			<View>
				{/* Verificar se há items antes de criar o titulo */}
				{prods.length > 0 && (
					<CategoryDetails>
						<CategoryDetailsText>
							{
								strings.ListProductsComponent_Title_ProductsNextToExp
							}
						</CategoryDetailsText>
					</CategoryDetails>
				)}
			</View>
		);
	}, [prods]);

	const EmptyList = useCallback(() => {
		return (
			<EmptyListText>
				{strings.ListProductsComponent_Title_NoProductsInList}
			</EmptyListText>
		);
	}, []);

	const FooterButton = useCallback(() => {
		return <InvisibleComponent />;
	}, []);

	const switchSelectedItem = useCallback(
		(productId: string) => {
			const isChecked = selectedProds.find(id => id === productId);

			if (!isChecked) {
				const prodsIds = [...selectedProds, productId];

				setSelectedProds(prodsIds);
				return;
			}

			const newSelected = selectedProds.filter(id => id !== productId);
			setSelectedProds(newSelected);
		},
		[selectedProds]
	);

	const handleEnableSelectMode = useCallback(() => {
		if (isAdmin) setSelectMode(true);
	}, [isAdmin]);

	const handleDisableSelectMode = useCallback(() => {
		setSelectMode(false);
	}, []);

	const renderComponent = useCallback(
		({ item }) => {
			const product: IProduct = item as IProduct;
			product.batches = sortBatches(product.batches);
			product.batches = removeCheckedBatches(product.batches);

			const isChecked = selectedProds.find(id => id === product.id);

			return (
				<ProductContainer onLongPress={handleEnableSelectMode}>
					{selectMode && (
						<SelectButtonContainer>
							<SelectButton
								onPress={() => switchSelectedItem(product.id)}
							>
								{isChecked ? (
									<SelectIcon name="checkmark-circle-outline" />
								) : (
									<SelectIcon name="ellipse-outline" />
								)}
							</SelectButton>
						</SelectButtonContainer>
					)}
					<ProductItem
						product={product}
						handleEnableSelect={handleEnableSelectMode}
					/>
				</ProductContainer>
			);
		},
		[handleEnableSelectMode, selectMode, selectedProds, switchSelectedItem]
	);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		if (onRefresh) {
			onRefresh();
		}
		setRefreshing(false);
	}, [onRefresh]);

	const handleSwitchDeleteModal = useCallback(() => {
		setDeleteModal(!deleteModal);
	}, [deleteModal]);

	const handleDeleteMany = useCallback(async () => {
		if (selectedProds.length <= 0) {
			handleDisableSelectMode();
			setDeleteModal(false);
			return;
		}
		try {
			if (!teamContext.id) {
				return;
			}

			await deleteManyProducts({
				productsIds: selectedProds,
				team_id: teamContext.id,
			});

			if (onRefresh) onRefresh();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [handleDisableSelectMode, onRefresh, selectedProds, teamContext.id]);

	return (
		<Container>
			{isAdmin && (
				<ActionButtons
					selectMode={selectMode}
					onCancelDelete={handleDisableSelectMode}
					onConfirmDelete={handleSwitchDeleteModal}
				/>
			)}
			<FlatList
				ref={listRef}
				data={prods}
				keyExtractor={item => String(item.id)}
				ListHeaderComponent={ListHeader}
				renderItem={renderComponent}
				ListEmptyComponent={EmptyList}
				initialNumToRender={10}
				ListFooterComponent={FooterButton}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
					/>
				}
				numColumns={Dimensions.get('screen').width > 600 ? 2 : 1}
			/>

			{!deactiveFloatButton && (
				<FloatButton
					icon={() => (
						<Icons name="add-outline" color="white" size={22} />
					)}
					small
					label={strings.View_FloatMenu_AddProduct}
					onPress={handleNavigateAddProduct}
				/>
			)}

			<Dialog
				visible={deleteModal}
				onDismiss={handleSwitchDeleteModal}
				onConfirm={handleDeleteMany}
				title={strings.ListProductsComponent_DeleteProducts_Modal_Title}
				description={
					strings.ListProductsComponent_DeleteProducts_Modal_Description
				}
				confirmText={
					strings.ListProductsComponent_DeleteProducts_Modal_Button_Delete
				}
				cancelText={
					strings.ListProductsComponent_DeleteProducts_Modal_Button_Keep
				}
			/>
		</Container>
	);
};

export default ListProducts;
