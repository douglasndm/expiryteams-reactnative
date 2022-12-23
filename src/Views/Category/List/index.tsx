import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import List from '@views/Category/List';

import { useTeam } from '~/Contexts/TeamContext';

import {
	getAllCategoriesFromTeam,
	createCategory,
} from '~/Functions/Categories';

const CategoryList: React.FC = () => {
	const teamContext = useTeam();

	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [categories, setCategories] = useState<ICategory[]>([]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;

		try {
			setIsLoading(true);

			const cats = await getAllCategoriesFromTeam({
				team_id: teamContext.id,
			});

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
	}, [teamContext.id]);

	const createCategoryProgress = useCallback(
		async (name: string) => {
			if (!teamContext.id) return;

			try {
				setIsAdding(true);

				const newCategory = await await createCategory({
					name,
					team_id: teamContext.id,
				});

				setCategories([...categories, newCategory]);
			} finally {
				setIsAdding(false);
			}
		},
		[categories, teamContext.id]
	);

	const isManager = useMemo(() => {
		if (teamContext.roleInTeam)
			if (teamContext.roleInTeam.role.toLowerCase() === 'manager') {
				return true;
			}
		return false;
	}, [teamContext.roleInTeam]);

	useEffect(() => {
		loadData();
	}, []);

	return (
		<List
			categories={categories}
			isLoading={isLoading}
			isAdding={isAdding}
			allowCreate={isManager}
			createCategory={createCategoryProgress}
		/>
	);
};

export default CategoryList;
