import api from '~/Services/API';

import { getUserSession } from '~/Functions/Auth/Login';

interface getProductProps {
    productId: string;
}

export async function getProduct({
    productId,
}: getProductProps): Promise<IProduct | IAPIError> {
    try {
        const userSession = await getUserSession();
        const token = userSession?.token;

        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await api.get<IProduct>(`/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}
