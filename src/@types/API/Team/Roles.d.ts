interface IUserRoles {
    team: {
        id: string;
        name: string;
        active: boolean;
    };
    status: 'Pending' | 'Completed';
    role: 'manager' | 'supervisor' | 'repositor';
}
