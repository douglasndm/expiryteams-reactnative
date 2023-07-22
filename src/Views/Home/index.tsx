import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import AppError from '@teams/Errors/AppError';

import { searchProducts } from '@utils/Product/Search';

import Loading from '@components/Loading';
import Header from '@components/Header';
import BarCodeReader from '@components/BarCodeReader';
import NotificationsDenny from '@components/NotificationsDenny';
import OutdateApp from '@components/OutdateApp';

import ListProducts from '@teams/Components/ListProducts';

import {
	Container,
	InputSearch,
	InputTextContainer,
	InputTextIcon,
	InputTextIconContainer,
	ActionButtonsContainer,
} from '@views/Home/styles';

import {
	getAllProducts,
	searchProducts as getSearchProducts,
	sortProductsByBatchesExpDate,
} from '@teams/Functions/Products/Products';

const Home: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();
	const teamContext = useTeam();

	const listRef = useRef<FlatList<IProduct>>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isMounted, setIsMounted] = useState(true);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [enableDatePicker, setEnableDatePicker] = useState(false);

	const [page, setPage] = useState(0);

	const [products, setProducts] = useState<Array<IProduct>>([]);

	const [searchString, setSearchString] = useState<string>();
	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [enableBarCodeReader, setEnableBarCodeReader] =
		useState<boolean>(false);

	const loadProducts = useCallback(
		async (pageNumber: number): Promise<IProduct[]> => {
			try {
				const productsResponse = await getAllProducts({
					team_id: teamContext.id || '',
					page: pageNumber,
				});

				return productsResponse;
			} catch (error) {
				if (error instanceof AppError) {
					showMessage({
						message: error.message,
						type: 'danger',
					});
					if (error.errorCode === 5) {
						reset({
							routes: [{ name: 'ViewTeam' }],
						});
					}
				}
				if (error instanceof Error)
					showMessage({
						message: error.message,
						type: 'danger',
					});
			}

			return [];
		},
		[reset, teamContext.id]
	);

	const initialLoad = useCallback(async () => {
		if (!isMounted) return;
		try {
			setIsLoading(true);
			const prods = await loadProducts(0);

			setProducts(prods);
		} finally {
			setIsLoading(false);
		}
	}, [isMounted, loadProducts]);

	const loadMoreProducts = useCallback(async () => {
		const nextPage = page + 1;

		const moreProds = await loadProducts(nextPage);
		const prods = products;

		moreProds.forEach(prod => {
			const exists = prods.find(produto => produto.id === prod.id);

			if (!exists) {
				prods.push(prod);
			}
		});

		setProducts(prods);

		setPage(nextPage);
	}, [loadProducts, page, products]);

	useEffect(() => {
		initialLoad();

		return () => {
			setIsMounted(false);
		};
	}, [initialLoad]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchString(value);

			if (value.trim() === '') {
				setProductsSearch(products);
			}
		},
		[products]
	);

	const handleSearch = useCallback(async () => {
		if (!teamContext.id || !searchString) return;

		if (searchString.trim() !== '') {
			const response = await getSearchProducts({
				team_id: teamContext.id,
				page: 0,
				query: searchString.trim(),
			});

			setProductsSearch(response);
		}
	}, [searchString, teamContext.id]);

	const handleOnBarCodeReaderOpen = useCallback(() => {
		setEnableBarCodeReader(true);
	}, []);

	const handleOnBarCodeReaderClose = useCallback(() => {
		setEnableBarCodeReader(false);
	}, []);

	const enableCalendarModal = useCallback(() => {
		setEnableDatePicker(true);
	}, []);

	const handleSelectDateChange = useCallback(
		(date: Date) => {
			setEnableDatePicker(false);

			let dateFormat = 'dd/MM/yyyy';
			if (getLocales()[0].languageCode === 'en') {
				dateFormat = 'MM/dd/yyyy';
			}
			const d = format(date, dateFormat);
			setSearchString(d);
			setSelectedDate(date);

			let prods: IProduct[] = [];

			if (d && d !== '') {
				prods = searchProducts({
					products,
					query: d,
				});
			}

			prods = sortProductsByBatchesExpDate({
				products: prods,
			});

			setProductsSearch(prods);
		},
		[products]
	);

	const handleOnCodeRead = useCallback(
		(code: string) => {
			setSearchString(code);
			setEnableBarCodeReader(false);

			let prods: IProduct[] = [];

			if (code && code !== '') {
				prods = searchProducts({
					products,
					query: code,
				});
			}

			prods = sortProductsByBatchesExpDate({
				products: prods,
			});

			setProductsSearch(prods);
		},
		[products]
	);

	return isLoading ? (
		<Loading />
	) : (
		<>
			{enableBarCodeReader ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleOnBarCodeReaderClose}
				/>
			) : (
				<Container>
					{teamContext.name && (
						<Header title={teamContext.name} listRef={listRef} />
					)}

					<NotificationsDenny />

					<OutdateApp />

					{products.length > 0 && (
						<InputTextContainer>
							<InputSearch
								placeholder={strings.View_Home_SearchText}
								value={searchString}
								onChangeText={handleSearchChange}
								onSubmitEditing={handleSearch}
							/>

							<ActionButtonsContainer>
								<InputTextIconContainer
									onPress={handleOnBarCodeReaderOpen}
								>
									<InputTextIcon name="barcode-outline" />
								</InputTextIconContainer>

								<InputTextIconContainer
									onPress={enableCalendarModal}
									style={{ marginLeft: 5 }}
								>
									<InputTextIcon name="calendar-outline" />
								</InputTextIconContainer>
							</ActionButtonsContainer>
						</InputTextContainer>
					)}

					<DatePicker
						modal
						mode="date"
						open={enableDatePicker}
						date={selectedDate}
						onConfirm={handleSelectDateChange}
						onCancel={() => {
							setEnableDatePicker(false);
						}}
					/>
					<ListProducts
						products={productsSearch}
						onRefresh={initialLoad}
						loadMoreProducts={loadMoreProducts}
						listRef={listRef}
					/>
				</Container>
			)}
		</>
	);
};

export default memo(Home);
