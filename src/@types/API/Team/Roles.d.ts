interface IUserRoles {
    team: {
        id: string;
        name: string;
        active: boolean;
    };
    status: 'Pending' | 'Completed';
    role: 'Manager' | 'Supervisor' | 'Repositor';
}
