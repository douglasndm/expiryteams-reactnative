import React, { useState, useEffect, useCallback, useContext } from 'react';
import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import { useTeam } from '@teams/Contexts/TeamContext';

import { getAllProducts } from '@teams/Functions/Products/Products';

import WeekViewComponent from '@views/Product/WeekView';

const WeekView: React.FC = () => {
	const teamContext = useTeam();

	const { preferences } = useContext(PreferencesContext);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;

		try {
			setIsLoading(true);
			const allProducts = await getAllProducts({
				sortByBatches: true,
				removeCheckedBatches: true,
				team_id: teamContext.id,
			});

			setProducts(allProducts);
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					type: 'danger',
					message: err.message,
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, [teamContext.id]);

	useEffect(() => {
		loadData();
	}, []);

	return (
		<WeekViewComponent
			products={products}
			howManyDaysToBeNextToExpire={
				preferences.howManyDaysToBeNextToExpire
			}
			isLoading={isLoading}
		/>
	);
};

export default WeekView;
