import api from '~/Services/API';

interface removeUserFromStoreProps {
    user_id: string;
    store_id: string;
    team_id: string;
}
async function addUserToStore({
    user_id,
    store_id,
    team_id,
}: removeUserFromStoreProps): Promise<void> {
    await api.post(`/team/${team_id}/stores/${store_id}/users`, {
        user_id,
    });
}

async function removeUserFromStore({
    user_id,
    store_id,
    team_id,
}: removeUserFromStoreProps): Promise<void> {
    await api.delete(`/team/${team_id}/stores/${store_id}/users`, {
        data: {
            user_id,
        },
    });
}

export { addUserToStore, removeUserFromStore };
