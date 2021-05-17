import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

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
    const userSession = auth().currentUser;

    const token = await userSession?.getIdTokenResult();

    try {
        const response = await api.get<getAllProductsFromCategoryResponse>(
            `/categories/${category_id}/products`,
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
