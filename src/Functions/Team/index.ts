import api from '~/Services/API';

import { clearSelectedteam } from './SelectedTeam';

interface createTeamProps {
    name: string;
}

export async function createTeam({ name }: createTeamProps): Promise<ITeam> {
    const response = await api.post<ITeam>(`/team`, {
        name,
    });

    return response.data;
}

interface editTeamProps {
    team_id: string;
    name: string;
}

export async function editTeam({
    team_id,
    name,
}: editTeamProps): Promise<void> {
    await api.put<ITeam>(`/team/${team_id}`, {
        name,
    });
}

interface deleteTeamProps {
    team_id: string;
}

export async function deleteTeam({ team_id }: deleteTeamProps): Promise<void> {
    await clearSelectedteam();
    await api.delete(`/team/${team_id}`);
}
