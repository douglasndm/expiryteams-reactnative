interface IUserRoles {
    team: {
        id: string;
        name: string;
    };
    status: 'Pending' | 'Completed';
    role: 'Manager' | 'Supervisor' | 'Repositor';
}
