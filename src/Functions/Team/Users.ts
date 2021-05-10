import api from '~/Services/API';

import { getUserSession } from '~/Functions/Auth/Login';

export async function getUserTeams(): Promise<Array<IUserRoles> | IAPIError> {
    try {
        const userSession = await getUserSession();
        const token = userSession?.token;

        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await api.get(`/users/${userSession?.user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}
