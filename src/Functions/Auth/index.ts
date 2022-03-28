import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import strings from '~/Locales';

import { loginFirebase } from './Firebase';
import { createSeassion } from './Session';

interface loginProps {
    email: string;
    password: string;
}

export async function login({
    email,
    password,
}: loginProps): Promise<FirebaseAuthTypes.User> {
    try {
        const user = await loginFirebase({
            email,
            password,
        });

        // Here we register the user device
        await createSeassion();

        return user;
    } catch (err) {
        let error = err;

        if (
            err.code === 'auth/wrong-password' ||
            err.code === 'auth/user-not-found'
        ) {
            error = strings.View_Login_Error_WrongEmailOrPassword;
        } else if (err.code === 'auth/network-request-failed') {
            error = strings.View_Login_Error_NetworkError;
        } else if (error === 'request error') {
            error = 'Erro de conexão';
        }

        throw new Error(error);
    }
}
