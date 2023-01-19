import api from '@teams/Services/API';

interface getUserResponse {
	id: string;
	email: string;
	name: string | null;
	last_name: string | null;
	roles: IUserRoles[];
}

async function getUser(): Promise<getUserResponse> {
	const user = await api.get<getUserResponse>('/users');

	return user.data;
}

export { getUser };
