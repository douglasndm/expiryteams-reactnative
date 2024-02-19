import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import List from '@views/Category/List';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	getAllCategoriesFromTeam,
	createCategory,
} from '@teams/Functions/Categories';

const CategoryList: React.FC = () => {
	const teamContext = useTeam();

	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [categories, setCategories] = useState<ICategory[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const cats = await getAllCategoriesFromTeam();

			setCategories(cats);
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

	const createCategoryProgress = useCallback(
		async (name: string) => {
			try {
				setIsAdding(true);

				const newCategory = await createCategory({
					name,
				});

				setCategories([...categories, newCategory]);
			} finally {
				setIsAdding(false);
			}
		},
		[categories]
	);

	const isManager = useMemo(() => {
		if (teamContext.roleInTeam) {
			const role = teamContext.roleInTeam.role.toLowerCase();
			if (role === 'manager' || role === 'supervisor') {
				return true;
			}
		}
		return false;
	}, [teamContext.roleInTeam]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<List
			categories={categories}
			isLoading={isLoading}
			isAdding={isAdding}
			allowCreate={isManager}
			showNoCategory={false}
			createCategory={createCategoryProgress}
		/>
	);
};

export default CategoryList;
