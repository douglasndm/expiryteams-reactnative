import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getMultiplesStoresForLegacyUsers(): Promise<boolean> {
    const result = await AsyncStorage.getItem('MultiplesStoresForLegacyUsers');

    if (result === 'true') {
        return true;
    }

    return false;
}
