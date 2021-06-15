import api from '~/Services/API';

interface createTeamProps {
    name: string;
}

export async function createTeam({ name }: createTeamProps): Promise<ITeam> {
    try {
        const response = await api.post<ITeam>(`/team`, {
            name,
        });

        return response.data;
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}

interface deleteTeamProps {
    team_id: string;
}

export async function deleteTeam({ team_id }: deleteTeamProps): Promise<void> {
    try {
        await api.delete(`/team/${team_id}`);
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}
