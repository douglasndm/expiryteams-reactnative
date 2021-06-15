import api from '~/Services/API';

interface getAllProductsFromCategoryProps {
    category_id: string;
}

interface getAllProductsFromCategoryResponse {
    category_name: string;
    products: Array<IProduct>;
}

export async function getAllProductsFromCategory({
    category_id,
}: getAllProductsFromCategoryProps): Promise<
    getAllProductsFromCategoryResponse
> {
    try {
        const response = await api.get<getAllProductsFromCategoryResponse>(
            `/categories/${category_id}/products`
        );

        return response.data;
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}
