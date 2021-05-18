import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

export async function getUserTeams(): Promise<Array<IUserRoles> | IAPIError> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const response = await api.get(`/users/${currentUser?.uid}`, {
            headers: {
                Authorization: `Bearer ${token?.token}`,
            },
        });

        const userRoles: Array<IUserRoles> = response.data.roles.map(role => ({
            role: role.role,
            team: {
                id: role.team.id,
                name: role.team.name,
            },
        }));

        return userRoles;
    } catch (err) {
        // console.log(err.response.data);
        if (err.message === 'Network Error') {
            throw new Error(err);
        }
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data,
        };

        return error;
    }
}

interface getAllUsersFromTeamProps {
    team_id: string;
}

export async function getAllUsersFromTeam({
    team_id,
}: getAllUsersFromTeamProps): Promise<Array<IUserInTeam> | IAPIError> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const response = await api.get<Array<IUserInTeam>>(
            `/team/${team_id}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        // console.log(err.response.data);
        if (err.message === 'Network Error') {
            throw new Error(err);
        }
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data,
        };

        return error;
    }
}
