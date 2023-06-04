import React, { useCallback, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	getCategory,
	updateCategory,
	deleteCategory,
} from '@teams/Functions/Categories';

import EditCategory from '@views/Category/Edit';

interface Props {
	id: string;
}
const Edit: React.FC = () => {
	const { params } = useRoute();
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const userRole = useMemo(() => {
		if (teamContext.roleInTeam) {
			return teamContext.roleInTeam.role.toLowerCase();
		}
		return 'repositor';
	}, [teamContext.roleInTeam]);

	const routeParams = params as Props;

	const getCategoryLocal = useCallback(async (id: string) => {
		return getCategory({ category_id: id });
	}, []);

	const updateCategoryLocal = useCallback(
		async (category: ICategory) => {
			await updateCategory({ category });

			reset({
				routes: [
					{ name: 'Home' },
					{
						name: 'ListCategory',
					},
				],
			});
		},
		[reset]
	);

	const deleteCategoryLocal = useCallback(
		async (id: string) => {
			await deleteCategory({ category_id: id });

			reset({
				routes: [
					{
						name: 'Home',
					},
					{ name: 'ListCategory' },
				],
			});
		},
		[reset]
	);

	return (
		<EditCategory
			id={routeParams.id}
			getCategory={getCategoryLocal}
			updateCategory={updateCategoryLocal}
			deleteCategory={deleteCategoryLocal}
			disableDelete={userRole === 'repositor'}
		/>
	);
};

export default Edit;
