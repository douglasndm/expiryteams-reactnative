import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import EnvConfig from 'react-native-config';
import { setUserId } from '../User';

interface GoogleUser {
    displayName: string | null;
    email: string | null;
    emailVerified: boolean;
    photoURL: string | null;
    providerId: string;
    uid: string;
}

GoogleSignin.configure({
    webClientId: EnvConfig.GOOGLE_SIGNIN_CLIENT_ID,
});

export async function isUserSignedIn(): Promise<boolean> {
    try {
        return GoogleSignin.isSignedIn();
    } catch (err) {
        throw new Error(err);
    }
}

export async function signInWithGoogle(): Promise<GoogleUser> {
    try {
        const isSignedIn = await GoogleSignin.isSignedIn();

        if (isSignedIn) {
            await GoogleSignin.signOut();
        }

        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const authResult = await auth().signInWithCredential(googleCredential);

        const user: GoogleUser = {
            displayName: authResult.user.displayName,
            email: authResult.user.email,
            emailVerified: authResult.user.emailVerified,
            photoURL: authResult.user.photoURL,
            providerId: authResult.user.providerId,
            uid: authResult.user.uid,
        };

        return user;
    } catch (err) {
        throw new Error(err);
    }
}
export async function signOutGoogle(): Promise<void> {
    try {
        const isSignedIn = await GoogleSignin.isSignedIn();

        if (isSignedIn) {
            await GoogleSignin.signOut();
            await setUserId('');
        }
    } catch (err) {
        throw new Error(err);
    }
}
