interface IProduct {
    id: string;
    name: string;
    code?: string;
    brand?: string;
    categories: Array<ICategory>;
    batches: Array<IBatch>;
}
