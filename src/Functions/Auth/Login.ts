import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export async function saveUserSession(
    sessionResponse: FirebaseAuthTypes.UserCredential
): Promise<void> {
    await AsyncStorage.setItem('userSession', JSON.stringify(sessionResponse));
}

export async function getUserSession(): Promise<FirebaseAuthTypes.UserCredential | null> {
    const userSessionJson = await AsyncStorage.getItem('userSession');

    if (!userSessionJson) return null;

    const userSession: FirebaseAuthTypes.UserCredential = JSON.parse(
        userSessionJson
    );

    return userSession;
}

export async function clearUserSession(): Promise<void> {
    await AsyncStorage.removeItem('userSession');
}
