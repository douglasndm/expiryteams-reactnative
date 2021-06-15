import auth from '@react-native-firebase/auth';
import * as Yup from 'yup';

import strings from '~/Locales';

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
            status: role.status,
            team: {
                id: role.team.id,
                name: role.team.name,
                active: role.team.isActive === true,
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

interface putUserInTeamProps {
    user_email: string;
    team_id: string;
}

interface putUserInTeamResponse {
    id: string;
    user: IUser;
    role: string;
    code: string;
    status: string;
}

export async function putUserInTeam({
    user_email,
    team_id,
}: putUserInTeamProps): Promise<putUserInTeamResponse> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const response = await api.post<putUserInTeamResponse>(
            `/team/${team_id}/manager/user`,
            {
                email: user_email,
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

interface enterTeamCode {
    code: string;
    team_id: string;
}

export async function enterTeamCode({
    code,
    team_id,
}: enterTeamCode): Promise<void> {
    const schema = Yup.object().shape({
        code: Yup.string().required().min(5),
        team_id: Yup.string().required().uuid(),
    });

    if (!(await schema.isValid({ code, team_id }))) {
        throw new Error('Informations are not valid');
    }

    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        await api.post<putUserInTeamResponse>(
            `/team/${team_id}/join`,
            {
                code,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );
    } catch (err) {
        if (err.message === 'Network Error') {
            throw new Error(err);
        } else if (err.response.data.error === 'Code is not valid') {
            throw new Error(strings.Function_Team_JoinTeam_InvalidCode);
        } else {
            throw new Error(err);
        }
    }
}

interface removeUserFromTeamProps {
    team_id: string;
    user_id: string;
}

export async function removeUserFromTeam({
    team_id,
    user_id,
}: removeUserFromTeamProps): Promise<void> {
    try {
        const { currentUser } = auth();
        const token = await currentUser?.getIdTokenResult();

        await api.delete(
            `/team/${team_id}/manager/user/${user_id}`,

            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );
    } catch (err) {
        if (err.response.data) {
            throw new Error(err.response.data);
        }
        throw new Error(err.message);
    }
}
