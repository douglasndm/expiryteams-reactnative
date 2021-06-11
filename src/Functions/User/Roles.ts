import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

interface updateUserRoleProps {
    user_id: string;
    team_id: string;
    newRole: 'repositor' | 'supervisor' | 'manager';
}

export async function updateUserRole({
    user_id,
    team_id,
    newRole,
}: updateUserRoleProps): Promise<void> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        await api.put(
            `/team/${team_id}/manager/user`,
            {
                user_id,
                role: newRole,
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
