interface IProduct {
    id: string;
    name: string;
    code?: string;
    categories: Array<ICategory>;
    batches: Array<IBatch>;
}
