import auth from '@react-native-firebase/auth';

import api from '../../Services/API';

import { getSelectedTeam } from '../Team/SelectedTeam';

interface getCategoryProps {
    category_id: string;
}

export async function getCategory({
    category_id,
}: getCategoryProps): Promise<ICategory | IAPIError> {
    const userSession = auth().currentUser;

    const token = await userSession?.getIdTokenResult();

    const selectedTeam = await getSelectedTeam();

    try {
        const response = await api.get<Array<ICategory>>(
            `/categories/team/${selectedTeam.team.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        const cat = response.data.find(c => c.id === category_id);

        if (!cat) {
            throw new Error('Category not found');
        }

        return cat;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}

interface getAllCategoriesProps {
    team_id: string;
}

export async function getAllCategoriesFromTeam({
    team_id,
}: getAllCategoriesProps): Promise<Array<ICategory>> {
    const userSession = auth().currentUser;

    const token = await userSession?.getIdTokenResult();

    try {
        const response = await api.get<Array<ICategory>>(
            `/categories/team/${team_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}

interface createCategoryProps {
    name: string;
    team_id: string;
}

export async function createCategory({
    name,
    team_id,
}: createCategoryProps): Promise<ICategory | IAPIError> {
    const userSession = auth().currentUser;

    const token = await userSession?.getIdTokenResult();

    try {
        const response = await api.post<ICategory>(
            `/categories`,
            {
                name,
                team_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}

interface updateCategoryProps {
    category: ICategory;
}
export async function updateCategory({
    category,
}: updateCategoryProps): Promise<ICategory | IAPIError> {
    const userSession = auth().currentUser;

    const token = await userSession?.getIdTokenResult();

    try {
        const response = await api.put<ICategory>(
            `/categories/${category.id}`,
            {
                name: category.name,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}

interface deleteCategoryProps {
    category_id: string;
}

export async function deleteCategory({
    category_id,
}: deleteCategoryProps): Promise<void | IAPIError> {
    const userSession = auth().currentUser;

    const token = await userSession?.getIdTokenResult();

    try {
        await api.delete(`/categories/${category_id}`, {
            headers: {
                Authorization: `Bearer ${token?.token}`,
            },
        });
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}
