import api from '~/Services/API';

interface getProductProps {
    productId: string;
}

export async function getProduct({
    productId,
}: getProductProps): Promise<IProduct> {
    const response = await api.get<IProduct>(`/products/${productId}`);

    return response.data;
}

interface createProductProps {
    team_id: string;
    product: Omit<IProduct, 'id' | 'categories'>;
    category: string | undefined;
}

export async function createProduct({
    team_id,
    product,
    category,
}: createProductProps): Promise<IProduct> {
    const response = await api.post<IProduct>(`/team/${team_id}/products`, {
        name: product.name,
        code: product.code,
        brand_id: product.brand,
        store_id: product.store,
        category_id: category,
    });

    return response.data;
}

interface updateProductProps {
    product: Omit<IProduct, 'batches' | 'categories'>;
    categories: Array<string>;
}

export async function updateProduct({
    product,
    categories,
}: updateProductProps): Promise<IProduct> {
    const response = await api.put<IProduct>(`/products/${product.id}`, {
        name: product.name,
        code: product.code,
        brand: product.brand,
        store_id: product.store,
        categories,
    });

    return response.data;
}

interface deleteProductProps {
    product_id: string;
}

export async function deleteProduct({
    product_id,
}: deleteProductProps): Promise<void> {
    await api.delete<IProduct>(`/products/${product_id}`);
}
