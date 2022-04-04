import api from '~/Services/API';

async function deleteSubscription(team_id: string): Promise<void> {
    await api.delete(`/team/${team_id}/subscriptions`);
}

export { deleteSubscription };
