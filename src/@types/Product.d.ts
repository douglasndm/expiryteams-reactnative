interface IProduct {
    id: string;
    name: string;
    code?: string;
    brand?: string | null;
    categories: Array<ICategory>;
    batches: Array<IBatch>;
}
