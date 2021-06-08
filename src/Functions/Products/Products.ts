import auth from '@react-native-firebase/auth';

import API from '~/Services/API';

interface getAllProductsProps {
    team_id: string;
}

export async function getAllProducts({
    team_id,
}: getAllProductsProps): Promise<Array<IProduct>> {
    try {
        const userSession = auth().currentUser;

        const token = await userSession?.getIdTokenResult();

        if (!team_id) {
            throw new Error('Provider team id');
        }

        const response = await API.get<IAllTeamProducts>(
            `/team/${team_id}/products`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
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
