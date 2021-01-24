import { appleAuth } from 'AppleAuth';
import { firebase } from '@react-native-firebase/auth';
import Analytics from '@react-native-firebase/analytics';
import { getUserInfo, setUserId } from '../User';

export async function signInWithApple(): Promise<IFirebaseUser> {
    console.log('Beginning Apple Authentication');

    // start a login request
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // 2). if the request was successful, extract the token and nonce
        const { identityToken, nonce } = appleAuthRequestResponse;

        // can be null in some scenarios
        if (identityToken) {
            // 3). create a Firebase `AppleAuthProvider` credential
            const appleCredential = firebase.auth.AppleAuthProvider.credential(
                identityToken,
                nonce
            );

            // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
            //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
            //     to link the account to an existing user
            const userCredential = await firebase
                .auth()
                .signInWithCredential(appleCredential);

            // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger

            await Analytics().logEvent('user_is_now_signed_with_apple');

            const user: IFirebaseUser = {
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                emailVerified: userCredential.user.emailVerified,
                photoURL: userCredential.user.photoURL,
                providerId: userCredential.user.providerId,
                uid: userCredential.user.uid,
            };

            return user;
        }
        throw new Error('Error while signing');
    } catch (error) {
        if (error.code === appleAuth.Error.CANCELED) {
            console.log('User canceled Apple Sign in.');
            return;
        }

        await Analytics().logEvent('error_while_signing_user_with_apple');
        throw new Error(error);
    }
}
export async function signOutApple(): Promise<void> {
    try {
        await setUserId('');

        await Analytics().logEvent('user_is_now_signout_apple');
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAppleUser(): Promise<IUser> {
    const user = await getUserInfo();

    if (user) {
        return user;
    }

    const nullUser: IUser = {
        name: null,
        email: null,
        photo: null,
    };

    return nullUser;
}
