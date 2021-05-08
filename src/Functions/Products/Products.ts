import API from '~/Services/API';

interface getAllProductsProps {
    team_id: string;
}

export async function getAllProducts({
    team_id,
}: getAllProductsProps): Promise<Array<IProduct>> {
    try {
        const response = await API.get<IAllTeamProducts>(
            `/team/${team_id}/products`
        );

        return response.data.products;
    } catch (err) {
        throw new Error(err.message);
    }
}
