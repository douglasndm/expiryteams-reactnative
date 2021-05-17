import auth from '@react-native-firebase/auth';

interface recoveryPasswordProps {
    email: string;
}

export async function recoveryPassword({
    email,
}: recoveryPasswordProps): Promise<void> {
    await auth().sendPasswordResetEmail(email);
}
