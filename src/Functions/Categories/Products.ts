import api from '~/Services/API';

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
}: getAllProductsFromCategoryProps): Promise<
    getAllProductsFromCategoryResponse
> {
    const response = await api.get<getAllProductsFromCategoryResponse>(
        `/team/${team_id}/categories/${category_id}/products`
    );

    return response.data;
}
