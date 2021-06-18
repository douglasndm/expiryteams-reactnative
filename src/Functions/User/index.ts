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
    try {
        const response = await api.get<IResponse>(`/users/${user_id}`);

        if (response) {
            return response.data;
        }
        return null;
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data.message);
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
    firebaseUid?: string;
}

export async function createUser({
    name,
    lastName,
    email,
    password,
    passwordConfirm,
    firebaseUid,
}: createUserProps): Promise<void> {
    try {
        await api.post<IUser>('/users', {
            name,
            lastName,
            email,
            password,
            passwordConfirmation: passwordConfirm,
            firebaseUid,
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
