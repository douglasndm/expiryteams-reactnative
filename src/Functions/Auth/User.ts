import auth from '@react-native-firebase/auth';

export function isUserSigned(): boolean {
    const { currentUser } = auth();

    if (!currentUser) {
        return false;
    }
    return true;
}
