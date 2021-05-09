import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveUserSession(
    sessionResponse: ISessionResponse
): Promise<void> {
    await AsyncStorage.setItem('userSession', JSON.stringify(sessionResponse));
}

export async function getUserSession(): Promise<ISessionResponse | null> {
    const userSessionJson = await AsyncStorage.getItem('userSession');

    if (!userSessionJson) return null;

    const userSession: ISessionResponse = JSON.parse(userSessionJson);

    return userSession;
}
