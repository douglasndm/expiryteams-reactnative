import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveUserLocally(user: IUser): Promise<void> {
    await AsyncStorage.setItem('user', JSON.stringify(user));
}

export async function getUserLocally(): Promise<IUser> {
    const response = await AsyncStorage.getItem('user');

    if (!response) {
        throw new Error('User was not found locally');
    }

    const user: IUser = JSON.parse(response);

    return user;
}
