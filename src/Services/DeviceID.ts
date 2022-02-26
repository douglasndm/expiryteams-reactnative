import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import UUIDGenerator from 'react-native-uuid-generator';

class DeviceId {
    // eslint-disable-next-line class-methods-use-this
    async getDeviceId(): Promise<string> {
        try {
            const token = await messaging().getToken();

            return token;
        } catch (err) {
            const deviceId = await AsyncStorage.getItem('DeviceId');

            if (!deviceId) {
                const id = await UUIDGenerator.getRandomUUID();
                await AsyncStorage.setItem('DeviceId', id);

                return id;
            }

            return deviceId;
        }
    }
}

export default DeviceId;
