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
    status: 'Pending' | 'Completed';
    role: 'manager' | 'supervisor' | 'repositor';
}
