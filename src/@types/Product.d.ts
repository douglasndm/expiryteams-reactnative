interface IProduct {
	id: string;
	name: string;
	code?: string;
	brand?: string | null;
	thumbnail?: string;
	store?: IStore;
	category?: ICategory;
	batches: Array<IBatch>;
	created_at: string;
	updated_at: string;
}
