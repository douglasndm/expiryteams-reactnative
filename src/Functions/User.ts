import AsyncStorage from '@react-native-async-storage/async-storage';

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

export async function getUserInfo(): Promise<IUser | null> {
    try {
        const userInfo = await AsyncStorage.getItem('User');

        if (!userInfo) {
            return null;
        }

        const user: IUser = JSON.parse(userInfo);

        return user;
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

export async function setUserInfo(user: IUser): Promise<void> {
    try {
        await AsyncStorage.setItem('User', JSON.stringify(user));
    } catch (err) {
        throw new Error(err);
    }
}
