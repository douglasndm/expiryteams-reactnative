import { loginFirebase } from './Firebase';
import { createSeassion } from './Session';

interface loginProps {
    email: string;
    password: string;
}

export async function login({ email, password }: loginProps): Promise<void> {
    await loginFirebase({
        email,
        password,
    });

    // Here we register the user device
    await createSeassion();
}
