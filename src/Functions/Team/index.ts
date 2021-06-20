import api from '~/Services/API';

import { clearSelectedteam } from './SelectedTeam';

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
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface deleteTeamProps {
    team_id: string;
}

export async function deleteTeam({ team_id }: deleteTeamProps): Promise<void> {
    try {
        await clearSelectedteam();
        await api.delete(`/team/${team_id}`);
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}
