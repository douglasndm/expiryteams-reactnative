import api from '~/Services/API';

interface createStoreProps {
    name: string;
    team_id: string;
}

async function createStore({
    name,
    team_id,
}: createStoreProps): Promise<IStore> {
    const response = await api.post<IStore>(`/team/${team_id}/stores`, {
        name,
    });

    return response.data;
}

export { createStore };
