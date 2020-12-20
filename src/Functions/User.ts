import AsyncStorage from '@react-native-community/async-storage';

export async function getUserId(): Promise<string> {
    try {
        const id = await AsyncStorage.getItem('UserId');

        if (!id) {
            return '';
        }

        return id;
    } catch (err) {
        throw new Error(err);
    }
}

export async function setUserId(id: string): Promise<void> {
    try {
        await AsyncStorage.setItem('UserId', id);
    } catch (err) {
        throw new Error(err);
    }
}
