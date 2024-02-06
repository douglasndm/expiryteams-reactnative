import React, { useState, useCallback, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';

import ListView from '@views/Brand/List';

import { createBrand, getAllBrands } from '@teams/Functions/Brand';

const BrandList: React.FC = () => {
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [brands, setBrands] = useState<IBrand[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await getAllBrands();

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
	}, []);

	const createBrandProgress = useCallback(
		async (name: string) => {
			try {
				setIsAdding(true);

				const newBrand = await createBrand({
					brandName: name,
				});

				setBrands([...brands, newBrand]);
			} finally {
				setIsAdding(false);
			}
		},
		[brands]
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
