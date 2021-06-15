import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

interface IResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
}

export async function getUser(): Promise<IResponse> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const response = await api.get<IResponse>(
            `/users/${currentUser?.uid}`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}

interface createUserProps {
    name?: string;
    lastName?: string;
    email: string;
    password?: string;
    passwordConfirm?: string;
}

export async function createUser({
    name,
    lastName,
    email,
    password,
    passwordConfirm,
}: createUserProps): Promise<void> {
    try {
        const { currentUser } = auth();

        await api.post<IUser>('/users', {
            firebaseUid: currentUser?.uid,
            name,
            lastName,
            email,
            password,
            passwordConfirmation: passwordConfirm,
        });
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}
