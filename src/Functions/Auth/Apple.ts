import Analytics from '@react-native-firebase/analytics';
import { getUserInfo, setUserId } from '../User';

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
