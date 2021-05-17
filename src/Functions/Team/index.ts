import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

interface createTeamProps {
    name: string;
}

export async function createTeam({
    name,
}: createTeamProps): Promise<ITeam | IAPIError> {
    const userSession = auth().currentUser;

    const token = await userSession?.getIdTokenResult();

    try {
        const response = await api.post<ITeam>(
            `/team`,
            {
                name,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}
