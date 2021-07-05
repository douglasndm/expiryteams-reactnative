import { FirebaseAuthTypes } from '@react-native-firebase/auth';

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
    const user = await loginFirebase({
        email,
        password,
    });

    // Here we register the user device
    await createSeassion();

    return user;
}
