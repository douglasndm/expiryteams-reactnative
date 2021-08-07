import api from '~/Services/API';

interface updateBatchDiscount {
    batch_id: string;
    temp_price: number;
}

export async function updateBatchDiscount({
    batch_id,
    temp_price,
}: updateBatchDiscount): Promise<void> {
    await api.post(`/batches/discount`, {
        batch_id,
        temp_price,
    });
}
