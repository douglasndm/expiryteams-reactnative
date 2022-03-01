import api from '~/Services/API';

interface getAllStoresFromTeamProps {
    team_id: string;
}

async function getAllStoresFromTeam({
    team_id,
}: getAllStoresFromTeamProps): Promise<IStore[]> {
    const response = await api.get<IStore[]>(`/team/${team_id}/stores`);

    return response.data;
}

export { getAllStoresFromTeam };
