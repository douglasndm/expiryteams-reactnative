interface IProduct {
    id: number;
    name: string;
    code?: string;
    store?: string;
    photo?: string;
    lotes: Array<ILote>;
}
