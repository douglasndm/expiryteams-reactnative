import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVersion } from 'react-native-device-info';

export async function getMultiplesStoresForLegacyUsers(): Promise<boolean> {
    const result = await AsyncStorage.getItem('MultiplesStoresForLegacyUsers');

    if (result === 'true') {
        return true;
    }

    return false;
}

async function setSetting(): Promise<void> {
    const currentAppVersion = getVersion();

    if (currentAppVersion === '1.6.3' || currentAppVersion === '1.6.4') {
        await AsyncStorage.setItem(
            'MultiplesStoresForLegacyUsers',
            String(true)
        );
    }
}

setSetting();
