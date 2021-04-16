import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUserId, setUserId } from '../User';

import { getAppleUser } from './Apple';
import {
    isUserSignedInWithGoogle,
    signOutGoogle,
    getUserWithGoogle,
} from './Google';

export async function signOut(): Promise<void> {
    try {
        await signOutGoogle();
        await AsyncStorage.setItem('AuthenticationProvider', '');
        await setUserId('');
    } catch (err) {
        throw new Error(err);
    }
}

export async function isUserSignedIn(): Promise<boolean> {
    try {
        // first version of app on ios was build in with google login and not apple
        // apple require to use apple login, this check if old user already logged with google
        // and remove login, then they can login again with apple
        if (Platform.OS === 'ios') {
            const providerChecker = await AsyncStorage.getItem(
                'AuthenticationProvider'
            );

            if (!providerChecker || providerChecker !== 'Apple') {
                await signOut();
            }
        }

        const isSignedInGoogle = await isUserSignedInWithGoogle();

        if (isSignedInGoogle) {
            return true;
        }

        const userId = await getUserId();

        if (userId && userId !== '') {
            return true;
        }

        return false;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getUser(): Promise<IUser | null> {
    try {
        const googleUser = await getUserWithGoogle();

        if (googleUser) {
            return googleUser;
        }

        const appleUser = await getAppleUser();

        if (appleUser) {
            return appleUser;
        }

        return null;
    } catch (err) {
        throw new Error(err.message);
    }
}
