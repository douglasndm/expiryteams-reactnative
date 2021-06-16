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

        if (!currentUser) {
            throw new Error('User is not logged');
        }

        const response = await api.get<IResponse>(`/users/${currentUser.uid}`);

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

interface updateUserProps {
    name?: string;
    lastName?: string;
}

export async function updateUser({
    name,
    lastName,
}: updateUserProps): Promise<IUser> {
    try {
        const updatedUser = await api.put<IUser>('/users', {
            name,
            lastName,
        });

        return updatedUser.data;
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

export async function deleteUser(): Promise<void> {
    try {
        await api.delete('/users');
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}
