import api from '@teams/Services/API';

import { fixProductsDates } from '../Products/Products';

interface getAllProductsFromCategoryProps {
	team_id: string;
	category_id: string;
}

interface getAllProductsFromCategoryResponse {
	category_name: string;
	products: Array<IProduct>;
}

export async function getAllProductsFromCategory({
	team_id,
	category_id,
}: getAllProductsFromCategoryProps): Promise<getAllProductsFromCategoryResponse> {
	const { data } = await api.get<getAllProductsFromCategoryResponse>(
		`/team/${team_id}/categories/${category_id}/products`
	);

	const products = fixProductsDates(data.products);

	return {
		category_name: data.category_name,
		products,
	};
}
