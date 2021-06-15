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

        if (!response.data) {
            return [];
        }
        return response.data.products;
    } catch (err) {
        if (!err.response) {
            throw new Error('Network error');
        }
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}
