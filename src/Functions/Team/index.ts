import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

interface createTeamProps {
    name: string;
}

export async function createTeam({ name }: createTeamProps): Promise<ITeam> {
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
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}
