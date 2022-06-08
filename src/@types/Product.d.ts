interface IProduct {
    id: string;
    name: string;
    code?: string;
    brand?: string | null;
    store?: IStore;
    categories: Array<ICategory>;
    batches: Array<IBatch>;
    created_at: string;
    updated_at: string;
}
