import api from '../../Services/API';

import { getUserSession } from '../Auth/Login';

interface getAllCategoriesProps {
    team_id: string;
}

export async function getAllCategoriesFromTeam({
    team_id,
}: getAllCategoriesProps): Promise<Array<ICategory> | IAPIError> {
    const userSession = await getUserSession();
    const token = userSession?.token;

    if (!token) {
        throw new Error('Token is missing');
    }

    try {
        const response = await api.get<Array<ICategory>>(
            `/categories/team/${team_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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

interface createCategoryProps {
    name: string;
    team_id: string;
}

export async function createCategory({
    name,
    team_id,
}: createCategoryProps): Promise<ICategory | IAPIError> {
    const userSession = await getUserSession();
    const token = userSession?.token;

    if (!token) {
        throw new Error('Token is missing');
    }

    try {
        const response = await api.post<ICategory>(
            `/categories`,
            {
                name,
                team_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
