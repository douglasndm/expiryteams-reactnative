import API from '~/Services/API';

import { getUserSession } from '~/Functions/Auth/Login';

interface getAllProductsProps {
    team_id: string;
}

export async function getAllProducts({
    team_id,
}: getAllProductsProps): Promise<Array<IProduct>> {
    try {
        const userSession = await getUserSession();
        const token = userSession?.token;

        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await API.get<IAllTeamProducts>(
            `/team/${team_id}/products`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.products;
    } catch (err) {
        throw new Error(err.message);
    }
}
