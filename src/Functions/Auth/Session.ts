import api from '~/Services/API';

import { clearSelectedteam } from '../Team/SelectedTeam';
import { logoutFirebase } from './Firebase';

interface createSeassionProps {
    user_token: string;
}

export async function createSeassion({
    user_token,
}: createSeassionProps): Promise<void> {
    await api.post(
        `/sessions`,
        {},
        {
            headers: {
                Authorization: `Bearer ${user_token}`,
            },
        }
    );
}

export async function destroySession(): Promise<void> {
    await clearSelectedteam();
    await logoutFirebase();
}
