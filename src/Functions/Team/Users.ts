import * as Yup from 'yup';

import strings from '@teams/Locales';

import api from '@teams/Services/API';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface getUserTeamsResponse {
	id: string;
	fid: string;
	email: string;
	name?: string;
	last_name?: string;
	role?: {
		role: string;
		code: string | null;
		status: string | null;
		team: {
			id: string;
			name: string;
			isActive?: boolean;
			subscriptions?: [
				{
					expireIn: Date;
					membersLimit: number;
					isActive: boolean;
				}
			];
		};
	};
	store: {
		id: string;
		name: string;
	} | null;
}

export async function getUserTeams(): Promise<getUserTeamsResponse> {
	const { data } = await api.get<getUserTeamsResponse>(`/users`);

	if (data.role && data.role.team.isActive) {
		const fixed = {
			...data,
			role: {
				team: {
					isActive: data.role?.team.isActive,
				},
			},
		};

		return fixed;
	}

	return data;
}

export async function getAllUsersFromTeam(): Promise<Array<IUserInTeam>> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<Array<IUserInTeam>>(
		`/team/${currentTeam.id}/users`
	);

	return response.data;
}

interface putUserInTeamProps {
	user_email: string;
	team_id: string;
}

interface putUserInTeamResponse {
	user: IUser;
	team: ITeam;
	role: string;
	code: string;
	status: string;
}

export async function putUserInTeam({
	user_email,
	team_id,
}: putUserInTeamProps): Promise<putUserInTeamResponse> {
	const response = await api.post<putUserInTeamResponse>(
		`/team/${team_id}/manager/user`,
		{
			email: user_email,
		}
	);

	return response.data;
}

interface IEnterTeamCode {
	code: string;
	team_id: string;
}

export async function enterTeamCode({
	code,
	team_id,
}: IEnterTeamCode): Promise<void> {
	const schema = Yup.object().shape({
		code: Yup.string().required().min(5),
		team_id: Yup.string().required().uuid(),
	});

	if (!(await schema.isValid({ code, team_id }))) {
		throw new Error('Informations are not valid');
	}

	try {
		await api.post<putUserInTeamResponse>(`/team/${team_id}/join`, {
			code,
		});
	} catch (err) {
		if (err.message === 'Network Error') {
			throw new Error(err);
		} else if (err.response.data.message === 'Code is not valid') {
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
	await api.delete(`/team/${team_id}/manager/user/${user_id}`);
}
