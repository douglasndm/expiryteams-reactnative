import api from '~/Services/API';

import { getSelectedTeam } from '../Team/SelectedTeam';

export async function getAllCategoriesFromTeam({
    team_id,
}: getAllCategoriesProps): Promise<Array<ICategory>> {
    const response = await api.get<Array<ICategory>>(
        `/team/${team_id}/categories`
    );

    return response.data;
}

interface getCategoryProps {
    category_id: string;
}

export async function getCategory({
    category_id,
}: getCategoryProps): Promise<ICategory> {
    const selectedTeam = await getSelectedTeam();

    if (!selectedTeam) {
        throw new Error('Team is not selected');
    }

    const categories = await getAllCategoriesFromTeam({
        team_id: selectedTeam.userRole.team.id,
    });

    const cat = categories.find(c => c.id === category_id);

    if (!cat) {
        throw new Error('Category not found');
    }

    return cat;
}

interface getAllCategoriesProps {
    team_id: string;
}

interface createCategoryProps {
    name: string;
    team_id: string;
}

export async function createCategory({
    name,
    team_id,
}: createCategoryProps): Promise<ICategory> {
    const response = await api.post<ICategory>(`/team/${team_id}/categories`, {
        name,
    });

    return response.data;
}

interface updateCategoryProps {
    category: ICategory;
}
export async function updateCategory({
    category,
}: updateCategoryProps): Promise<ICategory> {
    const selectedTeam = await getSelectedTeam();

    if (!selectedTeam) {
        throw new Error('Team is not selected');
    }
    const response = await api.put<ICategory>(
        `/team/${selectedTeam.userRole.team.id}/categories/${category.id}`,
        {
            name: category.name,
        }
    );

    return response.data;
}

interface deleteCategoryProps {
    category_id: string;
}

export async function deleteCategory({
    category_id,
}: deleteCategoryProps): Promise<void> {
    const selectedTeam = await getSelectedTeam();

    if (!selectedTeam) {
        throw new Error('Team is not selected');
    }
    await api.delete(
        `/team/${selectedTeam.userRole.team.id}/categories/${category_id}`
    );
}
