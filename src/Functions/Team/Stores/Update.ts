import api from '~/Services/API';

interface updateStoreProps {
    name: string;
    store_id: string;
    team_id: string;
}

async function updateStore({
    name,
    store_id,
    team_id,
}: updateStoreProps): Promise<IStore> {
    const response = await api.put<IStore>(
        `/team/${team_id}/stores/${store_id}`,
        {
            name,
        }
    );

    return response.data;
}

export { updateStore };
