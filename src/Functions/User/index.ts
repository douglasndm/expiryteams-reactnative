import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

export async function saveUserLocally(user: IUser): Promise<void> {
    await AsyncStorage.setItem('user', JSON.stringify(user));
}

export async function getUserLocally(): Promise<IUser> {
    const response = await AsyncStorage.getItem('user');

    if (!response) {
        throw new Error('User was not found locally');
    }

    const user: IUser = JSON.parse(response);

    return user;
}

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
    name: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
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
        const token = await currentUser?.getIdTokenResult();

        const response = await api.post<IUser>(
            '/users',
            {
                firebaseUid: currentUser?.uid,
                name,
                lastName,
                email,
                password,
                passwordConfirmation: passwordConfirm,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}
