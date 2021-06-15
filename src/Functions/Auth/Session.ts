import { clearSelectedteam } from '../Team/SelectedTeam';
import { logoutFirebase } from './Firebase';

export async function destroySession(): Promise<void> {
    await clearSelectedteam();
    await logoutFirebase();
}
