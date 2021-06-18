import api from '~/Services/API';

import { clearSelectedteam } from '../Team/SelectedTeam';
import { logoutFirebase } from './Firebase';

export async function createSeassion(): Promise<void> {
    await api.post(`/sessions`);
}

export async function destroySession(): Promise<void> {
    await clearSelectedteam();
    await logoutFirebase();
}
