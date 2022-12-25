import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';
import { format, parseISO } from 'date-fns';
import { getLocales } from 'react-native-localize';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { getProduct } from '@teams/Functions/Products/Product';

import Header from '@components/Header';
import Loading from '@components/Loading';

import BatchesTable from '@views/Product/View/Components/BatchesTable';

import {
	Container,
	Content,
	PageHeader,
	ProductContainer,
	ProductInformationContent,
	ProductName,
	ProductCode,
	ProductInfo,
	ActionsButtonContainer,
	ActionButton,
	PageContent,
	Icons,
	CategoryDetails,
	CategoryDetailsText,
	TableContainer,
	FloatButton,
} from './styles';

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

	const [lotesTratados, setLotesTratados] = useState<Array<IBatch>>([]);
	const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<IBatch>>([]);

	const dateFormat = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'MM/dd/yyyy';
		}
		return 'dd/MM/yyyy';
	}, []);

	const created_at = useMemo(() => {
		if (product)
			return format(parseISO(product.created_at), dateFormat, {});
		return null;
	}, [dateFormat, product]);

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

	const addNewLote = useCallback(() => {
		navigate('AddBatch', { productId });
	}, [navigate, productId]);

	const handleEdit = useCallback(() => {
		navigate('EditProduct', { product: JSON.stringify(product) });
	}, [navigate, product]);

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

	return isLoading ? (
		<Loading />
	) : (
		<>
			<Container>
				<Content>
					<Header
						title={strings.View_ProductDetails_PageTitle}
						noDrawer
					/>
					<PageHeader>
						{!!product && (
							<ProductContainer>
								<ProductInformationContent>
									<ProductName>
										{!!product && product?.name}
									</ProductName>
									{!!product.code && product?.code && (
										<ProductCode>
											{strings.View_ProductDetails_Code}:{' '}
											{product.code}
										</ProductCode>
									)}
									<ProductInfo>
										{product.categories.length > 0 &&
											`${strings.View_ProductDetails_Categories}: ${product.categories[0].name}`}
									</ProductInfo>
									{created_at && (
										<ProductInfo>{`Adicionado em ${created_at}`}</ProductInfo>
									)}

									<ActionsButtonContainer>
										<ActionButton
											icon={() => (
												<Icons
													name="create-outline"
													size={22}
												/>
											)}
											onPress={handleEdit}
										>
											{
												strings.View_ProductDetails_Button_UpdateProduct
											}
										</ActionButton>
									</ActionsButtonContainer>
								</ProductInformationContent>
							</ProductContainer>
						)}
					</PageHeader>

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
									product_id={product?.id || ''}
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
									product_id={product?.id || ''}
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
