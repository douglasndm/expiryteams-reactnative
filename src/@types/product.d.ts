interface IProduct {
    id: number;
    name: string;
    code?: string;
    store?: string;
    photo?: string;
    categories: Array<string>;
    lotes: Array<ILote>;
}
