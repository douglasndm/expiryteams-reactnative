import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

interface createAccountProps {
    name: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export async function createAccount({
    name,
    lastName,
    email,
    password,
    passwordConfirm,
}: createAccountProps): Promise<IUser> {
    const user = await auth().createUserWithEmailAndPassword(email, password);

    await user.user.sendEmailVerification();

    const response = await api.post<IUser>('/users', {
        firebaseUid: user.user.uid,
        name,
        lastName,
        email,
        password,
        passwordConfirmation: passwordConfirm,
    });

    return response.data;
}

export async function isEmailConfirmed(): Promise<boolean> {
    await auth().currentUser?.reload();
    const confirmed = auth().currentUser?.emailVerified;

    return confirmed || false;
}

export async function resendConfirmationEmail(): Promise<void> {
    try {
        const user = auth().currentUser;

        await user?.sendEmailVerification();
    } catch (err) {
        throw new Error(err.message);
    }
}
