import OneSignal from 'react-native-onesignal';

import api from '~/Services/API';
import { getDeviceId } from '~/Services/DeviceID';

import { clearSelectedteam } from '../Team/SelectedTeam';
import { logoutFirebase } from './Firebase';

export async function createSeassion(): Promise<void> {
    const deviceId = await getDeviceId();

    const oneSignal = await OneSignal.getDeviceState();
    let oneSignalToken;
    if (oneSignal) {
        oneSignalToken = oneSignal.pushToken;
    }

    let firebaseToken;
    if (deviceId.firebase_messaging) {
        firebaseToken = deviceId.firebase_messaging;
    }

    const response = await api.post<IUser>(`/sessions`, {
        deviceId: deviceId.device_uuid,
        firebaseToken,
        oneSignalToken,
    });

    OneSignal.setEmail(response.data.email);
    if (response.data.id) {
        OneSignal.setExternalUserId(response.data.id);
    }
}

export async function destroySession(): Promise<void> {
    await clearSelectedteam();
    await logoutFirebase();
}
