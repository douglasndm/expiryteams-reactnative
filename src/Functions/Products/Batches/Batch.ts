import api from '~/Services/API';

import { getUserSession } from '~/Functions/Auth/Login';

interface createBatchProps {
    productId: string;
    batch: Omit<IBatch, 'id'>;
}

export async function createBatch({
    productId,
    batch,
}: createBatchProps): Promise<IBatch | IAPIError> {
    try {
        const userSession = await getUserSession();
        const token = userSession?.token;

        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await api.post<IBatch>(
            `/batches`,
            {
                product_id: productId,
                name: batch.name,
                exp_date: batch.exp_date,
                amount: batch.amount,
                price: batch.price,
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
