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
        await api.put(`/team/${team_id}/manager/user`, {
            user_id,
            role: newRole,
        });
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}
