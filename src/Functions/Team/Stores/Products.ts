import api from '~/Services/API';

interface getAllProductsFromStoreProps {
    team_id: string;
    store_id: string;
}

async function getAllProductsFromStore({
    team_id,
    store_id,
}: getAllProductsFromStoreProps): Promise<IProduct[]> {
    const response = await api.get<IProduct[]>(
        `/team/${team_id}/stores/${store_id}/products`
    );

    return response.data;
}

export { getAllProductsFromStore };
