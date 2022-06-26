interface getBatchProps {
    batch_id: string;
}
interface getBatchResponse {
    product: IProduct;
    batch: IBatch;
}

interface IBatchResponse {
    id: string;
    name: string;
    exp_date: string;
    amount: number;
    price: number;
    price_tmp: number;
    status: 'checked' | 'unchecked';
    product: IProduct;
    created_at: string;
    updated_at: string;
}

interface createBatchProps {
    productId: string;
    batch: Omit<IBatch, 'id'>;
}

interface updatebatchProps {
    batch: IBatch;
}

interface deleteBatchProps {
    batch_id: string;
}
