import api from '~/Services/API';

import { getUserSession } from '../Auth/Login';

interface getAllProductsFromCategoryProps {
    category_id: string;
}

interface getAllProductsFromCategoryResponse {
    category: string;
    products: Array<IProduct>;
}

export async function getAllProductsFromCategory({
    category_id,
}: getAllProductsFromCategoryProps): Promise<
    getAllProductsFromCategoryResponse | IAPIError
> {
    const userSession = await getUserSession();
    const token = userSession?.token;

    if (!token) {
        throw new Error('Token is missing');
    }

    try {
        const response = await api.get<getAllProductsFromCategoryResponse>(
            `/categories/${category_id}/products`,
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
