import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import UUIDGenerator from 'react-native-uuid-generator';

interface getDeviceIdResponse {
    device_uuid: string;
    firebase_messaging?: string;
}
async function getDeviceId(): Promise<getDeviceIdResponse> {
    const response: getDeviceIdResponse = {
        device_uuid: '',
        firebase_messaging: '',
    };

    try {
        const token = await messaging().getToken();
        await AsyncStorage.setItem('DeviceId', token);

        response.firebase_messaging = token;
    } catch (err) {
        if (err instanceof Error) {
            console.log(
                `Failed on get firebase messaging token: ${err.message}`
            );
        }
    }

    const prevId = await AsyncStorage.getItem('deviceUUID');

    if (!prevId) {
        const id = await UUIDGenerator.getRandomUUID();
        await AsyncStorage.setItem('deviceUUID', id);
        response.device_uuid = id;
    } else {
        response.device_uuid = prevId;
    }

    return response;
}

export { getDeviceId };
