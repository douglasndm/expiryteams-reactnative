import auth from '@react-native-firebase/auth';

import API from '~/Services/API';

interface getAllProductsProps {
    team_id: string;
}

export async function getAllProducts({
    team_id,
}: getAllProductsProps): Promise<Array<IProduct> | IAPIError> {
    try {
        const userSession = auth().currentUser;

        const token = await userSession?.getIdTokenResult();

        const response = await API.get<IAllTeamProducts>(
            `/team/${team_id}/products`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data.products;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}
