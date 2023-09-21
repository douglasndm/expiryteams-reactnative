import api from '@teams/Services/API';

import { fixProductsDates } from '@teams/Functions/Products/Products';

interface getAllProductsFromStoreProps {
	team_id: string;
	store_id: string;
}

async function getAllProductsFromStore({
	team_id,
	store_id,
}: getAllProductsFromStoreProps): Promise<IProduct[]> {
	const { data } = await api.get<IProduct[]>(
		`/team/${team_id}/stores/${store_id}/products`
	);

	const products = fixProductsDates(data);

	return products;
}

export { getAllProductsFromStore };
