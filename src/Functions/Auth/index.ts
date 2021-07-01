import { loginFirebase } from './Firebase';
import { createSeassion } from './Session';

import { reset } from '~/References/Navigation';

interface loginProps {
    email: string;
    password: string;
}

export async function login({ email, password }: loginProps): Promise<void> {
    const user = await loginFirebase({
        email,
        password,
    });

    // Here we register the user device
    await createSeassion();

    if (user.emailVerified) {
        reset({
            routesNames: ['TeamList'],
        });
    } else {
        reset({
            routesNames: ['VerifyEmail'],
        });
    }
}
