import api from '~/Services/API';
import { getDeviceId } from '~/Services/DeviceID';

import { clearSelectedteam } from '../Team/SelectedTeam';
import { logoutFirebase } from './Firebase';

export async function createSeassion(): Promise<void> {
    const deviceId = await getDeviceId();

    let firebaseToken;
    if (deviceId.firebase_messaging) {
        firebaseToken = deviceId.firebase_messaging;
    }

    await api.post<IUser>(`/sessions`, {
        deviceId: deviceId.device_uuid,
        firebaseToken,
    });
}

export async function destroySession(): Promise<void> {
    await clearSelectedteam();
    await logoutFirebase();
}
