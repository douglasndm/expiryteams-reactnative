import api from '~/Services/API';

interface findProductByCodeResponse {
    name: string;
    code: string;
}

async function findProductByCode(
    code: string
): Promise<findProductByCodeResponse | null> {
    const response = await api.get<findProductByCodeResponse>(
        `/products/search?query=${code}`
    );

    if (response.data !== null) return response.data;

    return null;
}

export { findProductByCode };
