import api from '~/Services/API';

interface deleteStoreProps {
    store_id: string;
    team_id: string;
}

async function deleteStore({
    store_id,
    team_id,
}: deleteStoreProps): Promise<void> {
    await api.delete<IStore>(`/team/${team_id}/stores/${store_id}`);
}

export { deleteStore };
