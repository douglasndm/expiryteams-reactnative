import api from '@teams/Services/API';

interface removeItSelfFromTeamProps {
	team_id: string;
}

async function removeItSelfFromTeam({
	team_id,
}: removeItSelfFromTeamProps): Promise<void> {
	await api.delete(`/team/${team_id}/user`);
}

export { removeItSelfFromTeam };
