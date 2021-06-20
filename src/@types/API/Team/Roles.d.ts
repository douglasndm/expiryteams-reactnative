interface IUserRoles {
    team: {
        id: string;
        name: string;
        active: boolean;
        subscription?: {
            expireIn: Date;
            membersLimit: number;
        };
    };
    status: 'pending' | 'completed';
    role: 'manager' | 'supervisor' | 'repositor';
}
