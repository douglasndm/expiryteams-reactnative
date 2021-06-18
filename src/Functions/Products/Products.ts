import API from '~/Services/API';

interface getAllProductsProps {
    team_id: string;
}

export async function getAllProducts({
    team_id,
}: getAllProductsProps): Promise<Array<IProduct>> {
    try {
        if (!team_id) {
            throw new Error('Provider team id');
        }

        const response = await API.get<IAllTeamProducts>(
            `/team/${team_id}/products`
        );

        if (response) {
            return response.data.products;
        }

        return [];
    } catch (err) {
        if (!err.response) {
            throw new Error('Network error');
        }
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}
