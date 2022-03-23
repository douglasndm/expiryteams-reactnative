import api from '~/Services/API';

export async function getBatch({
    batch_id,
}: getBatchProps): Promise<getBatchResponse> {
    const response = await api.get<IBatchResponse>(`/batches/${batch_id}`);

    const responseData: getBatchResponse = {
        product: response.data.product,
        batch: response.data,
    };
    return responseData;
}

export async function createBatch({
    productId,
    batch,
}: createBatchProps): Promise<IBatch> {
    let body: any = {
        product_id: productId,
        name: batch.name,
        exp_date: batch.exp_date,
        amount: batch.amount,
        status: batch.status,
    };

    if (batch.price) {
        body = {
            ...body,
            price: batch.price,
        };
    }

    const response = await api.post<IBatch>(`/batches`, body);

    return response.data;
}

export async function updateBatch({
    batch,
}: updatebatchProps): Promise<IBatch> {
    const response = await api.put<IBatch>(`/batches/${batch.id}`, {
        name: batch.name,
        exp_date: batch.exp_date,
        amount: batch.amount,
        price: batch.price,
        status: batch.status,
    });

    return response.data;
}

export async function deleteBatch({
    batch_id,
}: deleteBatchProps): Promise<void> {
    await api.delete<IBatch>(`/batches/${batch_id}`);
}
