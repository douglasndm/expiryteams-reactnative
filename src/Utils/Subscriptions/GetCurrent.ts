import api from '@teams/Services/API';

import { getCurrentTeam } from '../Settings/CurrentTeam';

// this function will get the current subscription on server
// and it will also force update it on revenuecat if there is not subscription
async function getCurrentSubscription(): Promise<ITeamSubscription | null> {
	const currentTeam = await getCurrentTeam();
	if (!currentTeam) return null;

	const { data } = await api.get<ITeamSubscription>(
		`/team/${currentTeam.id}/subscriptions`
	);

	return data || null;
}

export { getCurrentSubscription };
