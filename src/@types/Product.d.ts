interface IProduct {
    id: string;
    name: string;
    code?: string;
    batches: Array<IBatch>;
}
