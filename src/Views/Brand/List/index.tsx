import React, { useState, useCallback, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';

import ListView from '@views/Brand/List';

import { useTeam } from '@teams/Contexts/TeamContext';

import { createBrand, getAllBrands } from '@teams/Functions/Brand';

const BrandList: React.FC = () => {
	const teamContext = useTeam();

	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [brands, setBrands] = useState<IBrand[]>([]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			setIsLoading(true);

			const response = await getAllBrands({
				team_id: teamContext.id,
			});

			setBrands(response);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [teamContext.id]);

	const createBrandProgress = useCallback(
		async (name: string) => {
			if (!teamContext.id) return;
			try {
				setIsAdding(true);

				const newBrand = await createBrand({
					brandName: name,
					team_id: teamContext.id,
				});

				setBrands([...brands, newBrand]);
			} finally {
				setIsAdding(false);
			}
		},
		[brands, teamContext.id]
	);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<ListView
			brands={brands}
			isLoading={isLoading}
			isAdding={isAdding}
			createBrand={createBrandProgress}
		/>
	);
};

export default BrandList;
