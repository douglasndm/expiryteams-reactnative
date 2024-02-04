import Purchases from '@services/RevenueCat';
import api from '@teams/Services/API';

import { getSelectedTeam } from './SelectedTeam';

async function setup() {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) return;
	if (selectedTeam && selectedTeam.userRole.role.toLowerCase() !== 'manager')
		return;

	if (selectedTeam) {
		await Purchases.logIn(selectedTeam.userRole.team.id);
	}
}

async function getTeamSubscription(
	team_id: string
): Promise<ITeamSubscription> {
	const response = await api.get<ITeamSubscription>(
		`/team/${team_id}/subscriptions`
	);

	return response.data;
}

async function deleteTeamSubscription(team_id: string): Promise<void> {
	await api.delete(`/team/${team_id}/subscriptions`);
}

async function isSubscriptionActive(team_id: string): Promise<boolean> {
	const response = await api.get<Subscription[]>(
		`/team/${team_id}/subscriptions/store`
	);

	const anyActive = response.data.find(
		sub => sub.subscription.unsubscribe_detected_at === null
	);

	return !!anyActive;
}

setup();

export { getTeamSubscription, deleteTeamSubscription, isSubscriptionActive };
