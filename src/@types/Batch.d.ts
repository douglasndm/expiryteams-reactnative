interface IBatch {
    id: string;
    name: string;
    exp_date: string;
    amount?: number;
    price?: number;
    price_tmp?: number;
    status: 'checked' | 'unchecked';
}
