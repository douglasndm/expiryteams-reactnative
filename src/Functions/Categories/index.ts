import api from '../../Services/API';

import { getSelectedTeam } from '../Team/SelectedTeam';

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

    const response = await api.get<Array<ICategory>>(
        `/categories/team/${selectedTeam.team.id}`
    );

    const cat = response.data.find(c => c.id === category_id);

    if (!cat) {
        throw new Error('Category not found');
    }

    return cat;
}

interface getAllCategoriesProps {
    team_id: string;
}

export async function getAllCategoriesFromTeam({
    team_id,
}: getAllCategoriesProps): Promise<Array<ICategory>> {
    const response = await api.get<Array<ICategory>>(
        `/categories/team/${team_id}`
    );

    return response.data;
}

interface createCategoryProps {
    name: string;
    team_id: string;
}

export async function createCategory({
    name,
    team_id,
}: createCategoryProps): Promise<ICategory> {
    const response = await api.post<ICategory>(`/categories`, {
        name,
        team_id,
    });

    return response.data;
}

interface updateCategoryProps {
    category: ICategory;
}
export async function updateCategory({
    category,
}: updateCategoryProps): Promise<ICategory> {
    const response = await api.put<ICategory>(`/categories/${category.id}`, {
        name: category.name,
    });

    return response.data;
}

interface deleteCategoryProps {
    category_id: string;
}

export async function deleteCategory({
    category_id,
}: deleteCategoryProps): Promise<void> {
    await api.delete(`/categories/${category_id}`);
}
