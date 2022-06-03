import api from '~/Services/API';

interface isProductDuplicateProps {
    name: string;
    code?: string;
    team_id: string;
    store_id?: string;
}

interface isProductDuplicateResponse {
    isDuplicate: boolean;
    product_id?: string;
}

async function findDuplicate({
    name,
    code,
    team_id,
    store_id,
}: isProductDuplicateProps): Promise<isProductDuplicateResponse> {
    const response = await api.post<isProductDuplicateResponse>(
        `/team/${team_id}/products/duplicate`,
        {
            name,
            code,
            store_id,
        }
    );

    return response.data;
}

export { findDuplicate };
