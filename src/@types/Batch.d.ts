interface IBatch {
    id: string;
    name: string;
    exp_date: string;
    amount?: number;
    price?: number;
    status: 'checked' | 'unchecked';
}
