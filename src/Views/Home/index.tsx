import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import { searchProducts } from '@utils/Product/Search';

import Header from '@components/Header';
import BarCodeReader from '@components/BarCodeReader';
import NotificationsDenny from '@components/NotificationsDenny';
import OutdateApp from '@components/OutdateApp';

import {
	Container,
	InputSearch,
	InputTextContainer,
	InputTextIcon,
	InputTextIconContainer,
	ActionButtonsContainer,
} from '@views/Home/styles';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import {
	getAllProducts,
	sortProductsByBatchesExpDate,
} from '~/Functions/Products/Products';
import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

import AppError from '~/Errors/AppError';

import Loading from '@components/Loading';
import ListProducts from '~/Components/ListProducts';

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

			setProducts(productsResponse);
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
	}, []);

	useEffect(() => {
		if (isMounted) {
			setProductsSearch(products);
		}
	}, [isMounted, products]);

	const handleSearchChange = useCallback(
		async (search: string) => {
			setSearchString(search);

			let prods = sortProductsByBatchesExpDate({
				products,
			});

			if (search && search !== '') {
				const findProducts = searchProducts({
					products,
					query: search,
				});

				console.log(findProducts);

				prods = sortProductsByBatchesExpDate({
					products: findProducts,
				});
			}
			setProductsSearch(prods);
		},
		[products]
	);

	const handleOnBarCodeReaderOpen = useCallback(() => {
		setEnableBarCodeReader(true);
	}, []);

	const handleOnBarCodeReaderClose = useCallback(() => {
		setEnableBarCodeReader(false);
	}, []);

	const enableCalendarModal = useCallback(() => {
		setEnableDatePicker(true);
	}, []);

	const handleSelectDateChange = useCallback((date: Date) => {
		setEnableDatePicker(false);

		let dateFormat = 'dd/MM/yyyy';
		if (getLocales()[0].languageCode === 'en') {
			dateFormat = 'MM/dd/yyyy';
		}
		const d = format(date, dateFormat);
		setSearchString(d);
		setSelectedDate(date);
	}, []);

	const handleOnCodeRead = useCallback(
		code => {
			setSearchString(code);
			handleSearchChange(code);
			setEnableBarCodeReader(false);
		},
		[handleSearchChange]
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
