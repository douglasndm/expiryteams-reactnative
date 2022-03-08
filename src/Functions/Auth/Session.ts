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

    await api.post(`/sessions`, {
        deviceId: deviceId.device_uuid,
        firebaseToken: deviceId.firebase_messaging,
        oneSignalToken,
    });
}

export async function destroySession(): Promise<void> {
    await clearSelectedteam();
    await logoutFirebase();
}
