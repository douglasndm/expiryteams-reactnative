import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { getProduct } from '@teams/Functions/Products/Product';
import { imageExistsLocally, getLocally } from '@utils/Images/GetLocally';
import { saveLocally } from '@utils/Images/SaveLocally';

import Loading from '@components/Loading';
import Header from '@components/Header';

import PageHeader from '@views/Product/View/Components/PageHeader';
import BatchesTable from '@views/Product/View/Components/BatchesTable';

import {
	Container,
	Content,
	PageContent,
	CategoryDetails,
	CategoryDetailsText,
	TableContainer,
	FloatButton,
} from '@views/Product/View/styles';

interface Request {
	route: {
		params: {
			id: string;
		};
	};
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
	const teamContext = useTeam();

	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const productId = useMemo(() => {
		return route.params.id;
	}, [route.params.id]);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [product, setProduct] = useState<IProduct>();
	const [imagePath, setImagePath] = useState<string | undefined>();

	const [lotesTratados, setLotesTratados] = useState<Array<IBatch>>([]);
	const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<IBatch>>([]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			setIsLoading(true);
			const response = await getProduct({
				productId,
				team_id: teamContext.id,
			});

			setProduct(response);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [productId, teamContext.id]);

	const handleImage = useCallback(async () => {
		if (!product) return;
		if (product.code)
			try {
				const existsLocally = await imageExistsLocally(product.code);

				if (existsLocally) {
					const localImage = getLocally(product.code);

					if (Platform.OS === 'android') {
						setImagePath(`file://${localImage}`);
					} else if (Platform.OS === 'ios') {
						setImagePath(localImage);
					}
				} else if (product.thumbnail) {
					setImagePath(product.thumbnail);

					saveLocally(product.thumbnail, product.code.trim());
				}
			} catch (err) {
				setImagePath(undefined);
			}
	}, [product]);

	useEffect(() => {
		handleImage();
	}, [handleImage]);

	const addNewLote = useCallback(() => {
		navigate('AddBatch', { productId });
	}, [navigate, productId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		if (product) {
			setLotesTratados(() =>
				product?.batches.filter(batch => batch.status === 'checked')
			);

			setLotesNaoTratados(() =>
				product?.batches.filter(batch => batch.status !== 'checked')
			);
		}
	}, [product]);

	const handleEdit = useCallback(() => {
		navigate('EditProduct', { productId });
	}, [navigate, productId]);

	return isLoading ? (
		<Loading />
	) : (
		<>
			<Container>
				<Header
					title={strings.View_ProductDetails_PageTitle}
					noDrawer
					appBarActions={[
						{
							icon: 'square-edit-outline',
							onPress: handleEdit,
						},
					]}
				/>

				<Content>
					{product && (
						<PageHeader
							product={product}
							imagePath={imagePath}
							enableStore
							storeName={
								teamContext.roleInTeam?.store?.name || undefined
							}
						/>
					)}

					<PageContent>
						{lotesNaoTratados.length > 0 && (
							<TableContainer>
								<CategoryDetails>
									<CategoryDetailsText>
										{
											strings.View_ProductDetails_TableTitle_NotTreatedBatches
										}
									</CategoryDetailsText>
								</CategoryDetails>

								<BatchesTable
									batches={lotesNaoTratados}
									product={product}
								/>
							</TableContainer>
						)}

						{lotesTratados.length > 0 && (
							<>
								<CategoryDetails>
									<CategoryDetailsText>
										{
											strings.View_ProductDetails_TableTitle_TreatedBatches
										}
									</CategoryDetailsText>
								</CategoryDetails>

								<BatchesTable
									batches={lotesTratados}
									product={product}
								/>
							</>
						)}
					</PageContent>
				</Content>
			</Container>

			<FloatButton
				icon={() => (
					<Ionicons name="add-outline" color="white" size={22} />
				)}
				small
				label={strings.View_ProductDetails_FloatButton_AddNewBatch}
				onPress={addNewLote}
			/>
		</>
	);
};

export default ProductDetails;
