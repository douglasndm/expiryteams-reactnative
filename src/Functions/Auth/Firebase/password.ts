import auth from '@react-native-firebase/auth';

interface recoveryPasswordProps {
    email: string;
}

export async function recoveryPassword({
    email,
}: recoveryPasswordProps): Promise<void> {
    try {
        await auth().sendPasswordResetEmail(email);
    } catch (err) {
        if (err.code === 'auth/user-not-found') {
            throw new Error('Nenhum usuário encontrado com este e-mail');
        }
        throw new Error(err.message);
    }
}
