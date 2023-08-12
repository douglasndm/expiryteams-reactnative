import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	memo,
	useMemo,
} from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '@teams/Contexts/TeamContext';

import AppError from '@teams/Errors/AppError';

import Loading from '@components/Loading';

import ListProducts from '@teams/Components/ListProducts';

import HomeComponent from '@views/Home';
import { Container } from '@views/Home/styles';

import {
	getAllProducts,
	searchProducts as getSearchProducts,
} from '@teams/Functions/Products/Products';
import { format, isValid, parseISO } from 'date-fns';

const Home: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();
	const teamContext = useTeam();

	const listRef = useRef<FlatList<IProduct>>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [searchString, setSearchString] = useState<string>('');

	const [products, setProducts] = useState<Array<IProduct>>([]);

	const loadProducts = useCallback(async (): Promise<IProduct[]> => {
		if (!teamContext.id) return [];
		try {
			const productsResponse = await getAllProducts({
				team_id: teamContext.id,
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
	}, [reset, teamContext.id]);

	const initialLoad = useCallback(async () => {
		try {
			setIsLoading(true);

			const prods = await loadProducts();

			setProducts(prods);
		} finally {
			setIsLoading(false);
		}
	}, [loadProducts]);

	useEffect(() => {
		initialLoad();
	}, [initialLoad]);

	const handleSearch = useCallback(
		async (query?: string) => {
			if (!teamContext.id || !query) return;
			setSearchString(query);

			if (query.trim() !== '') {
				const arrayDate = query.split('/');
				const maybeDate = parseISO(
					`${arrayDate[2]}-${arrayDate[1]}-${arrayDate[0]}`
				);
				const isValidDate = isValid(maybeDate);

				let search = query.trim();

				if (isValidDate) {
					search = format(maybeDate, 'yyyy-MM-dd');
				}

				const response = await getSearchProducts({
					team_id: teamContext.id,
					query: search,
				});

				setProducts(response);
			}
		},
		[teamContext.id]
	);

	const onSearchChange = useCallback(
		async (q: string) => {
			setSearchString(q);

			if (q.trim() === '') {
				await initialLoad();
			}
		},
		[initialLoad]
	);

	const title = useMemo(() => {
		if (teamContext.roleInTeam?.store?.name) {
			return teamContext.roleInTeam.store.name;
		}
		if (teamContext.name) {
			return teamContext.name;
		}
		return '';
	}, [teamContext]);

	return (
		<Container>
			<HomeComponent
				title={title}
				isLoading={isLoading}
				productsListRef={listRef}
				searchFor={handleSearch}
				productsCount={products.length}
				onSearch={handleSearch}
				onSearchTextChange={onSearchChange}
				searchValue={searchString}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<ListProducts
					products={products}
					onRefresh={initialLoad}
					listRef={listRef}
				/>
			)}
		</Container>
	);
};

export default memo(Home);
