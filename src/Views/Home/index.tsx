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
import { getSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

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

	const [products, setProducts] = useState<Array<IProduct>>([]);

	const [searchString, setSearchString] = useState<string>();
	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [enableBarCodeReader, setEnableBarCodeReader] =
		useState<boolean>(false);

	const loadData = useCallback(async () => {
		if (!isMounted) return;
		try {
			setIsLoading(true);

			const selectedTeam = await getSelectedTeam();

			if (!selectedTeam) {
				return;
			}

			const productsResponse = await getAllProducts({
				team_id: selectedTeam.userRole.team.id,
			});

			const prods = productsResponse.map(p => ({
				...p,
				name: p.name.toLowerCase(),
				code: p.code?.toLowerCase(),
				batches: p.batches.map(b => ({
					...b,
					name: b.name.toLowerCase(),
				})),
			}));

			setProducts(prods);
		} catch (err) {
			if (err instanceof AppError) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
				if (err.errorCode === 5) {
					reset({
						routes: [{ name: 'ViewTeam' }],
					});
				}
			}
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [isMounted, reset]);

	useEffect(() => {
		loadData();

		return () => {
			setIsMounted(false);
		};
	}, [loadData]);

	useEffect(() => {
		if (isMounted) {
			setProductsSearch(products);
		}
	}, [isMounted, products]);

	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchString(value);

			if (value.trim() === '') {
				setProductsSearch(products);
			}
		},
		[products]
	);

	const handleSearch = useCallback(() => {
		let prods: IProduct[] = [];

		if (searchString && searchString !== '') {
			prods = searchProducts({
				products,
				query: searchString,
			});
		}

		prods = sortProductsByBatchesExpDate({
			products: prods,
		});

		setProductsSearch(prods);
	}, [products, searchString]);

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
		code => {
			setSearchString(code);
			handleSearchChange(code);
			setEnableBarCodeReader(false);

			let prods: IProduct[] = [];

			if (searchString && searchString !== '') {
				prods = searchProducts({
					products,
					query: searchString,
				});
			}

			prods = sortProductsByBatchesExpDate({
				products: prods,
			});

			setProductsSearch(prods);
		},
		[handleSearchChange, products, searchString]
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
						onRefresh={loadData}
						sortProdsByBatchExpDate={false}
						deactiveFloatButton
						listRef={listRef}
					/>
				</Container>
			)}
		</>
	);
};

export default memo(Home);
