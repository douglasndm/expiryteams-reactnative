import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface loginFirebaseProps {
    email: string;
    password: string;
}

export async function loginFirebase({
    email,
    password,
}: loginFirebaseProps): Promise<FirebaseAuthTypes.UserCredential> {
    const user = await auth().signInWithEmailAndPassword(email, password);

    return user;
}

export async function logoutFirebase(): Promise<void> {
    await auth().signOut();
}
