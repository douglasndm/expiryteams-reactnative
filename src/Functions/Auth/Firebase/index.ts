import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface loginFirebaseProps {
    email: string;
    password: string;
}

export async function loginFirebase({
    email,
    password,
}: loginFirebaseProps): Promise<FirebaseAuthTypes.User> {
    const user = await auth().signInWithEmailAndPassword(email, password);

    return user.user;
}

export async function logoutFirebase(): Promise<void> {
    await auth().signOut();
}
