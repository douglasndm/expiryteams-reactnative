import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setAllowedToReadIDFA(allow: boolean): Promise<void> {
    try {
        await AsyncStorage.setItem('Privacy/canUseIDFA', String(allow));
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAllowedToReadIDFA(): Promise<boolean | null> {
    try {
        const response = await AsyncStorage.getItem('Privacy/canUseIDFA');

        if (response) {
            if (response === 'false') {
                return false;
            }

            return true;
        }
        return null;
    } catch (err) {
        throw new Error(err.message);
    }
}
