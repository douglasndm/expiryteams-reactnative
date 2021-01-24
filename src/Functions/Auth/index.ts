import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUserId, setUserId, setUserInfo } from '../User';

import { getAppleUser, signInWithApple } from './Apple';
import {
    isUserSignedInWithGoogle,
    signInWithGoogle,
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

export async function signIn(
    provider: 'Google' | 'Apple'
): Promise<IFirebaseUser> {
    if (provider === 'Apple') {
        const user = await signInWithApple();

        await AsyncStorage.setItem('AuthenticationProvider', 'Apple');

        await setUserInfo({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
        });

        return user;
    }

    const user = await signInWithGoogle();
    await AsyncStorage.setItem('AuthenticationProvider', 'Google');

    await setUserInfo({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
    });

    return user;
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
