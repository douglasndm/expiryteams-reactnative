import api from '~/Services/API';

interface getProductProps {
    productId: string;
}

export async function getProduct({
    productId,
}: getProductProps): Promise<IProduct> {
    try {
        const response = await api.get<IProduct>(`/products/${productId}`);

        return response.data;
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface createProductProps {
    team_id: string;
    product: Omit<IProduct, 'id' | 'categories'>;
    categories: Array<string>;
}

export async function createProduct({
    team_id,
    product,
    categories,
}: createProductProps): Promise<IProduct> {
    try {
        const response = await api.post<IProduct>(`/products`, {
            team_id,
            name: product.name,
            code: product.code,
            categories,
        });

        return response.data;
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface updateProductProps {
    product: Omit<IProduct, 'batches' | 'categories'>;
    categories: Array<string>;
}

export async function updateProduct({
    product,
    categories,
}: updateProductProps): Promise<IProduct> {
    try {
        const response = await api.put<IProduct>(`/products/${product.id}`, {
            name: product.name,
            code: product.code,
            categories,
        });

        return response.data;
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface deleteProductProps {
    product_id: string;
}

export async function deleteProduct({
    product_id,
}: deleteProductProps): Promise<void> {
    try {
        await api.delete<IProduct>(`/products/${product_id}`);
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}
