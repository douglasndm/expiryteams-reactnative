import auth, { firebase } from '@react-native-firebase/auth';

import api from '~/Services/API';

interface IResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
}

interface getUserProps {
    user_id: string;
}

export async function getUser({
    user_id,
}: getUserProps): Promise<IResponse | null> {
    const response = await api.get<IResponse>(`/users/${user_id}`);

    if (response) {
        return response.data;
    }
    return null;
}

interface deleteUserProps {
    password: string;
}

export async function deleteUser({ password }: deleteUserProps): Promise<void> {
    const user = auth().currentUser;

    if (!user || !user?.email) {
        throw new Error("User doesn't have an Email");
    }

    const provider = firebase.auth.EmailAuthProvider;
    const authCredential = provider.credential(user.email, password);

    await user.reauthenticateWithCredential(authCredential);

    await api.delete('/users');

    if (user) {
        await user.delete();
    }
}
