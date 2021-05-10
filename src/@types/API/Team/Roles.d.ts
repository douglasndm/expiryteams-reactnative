interface IUserRoles {
    team: {
        id: string;
        name: string;
    };
    role: 'Manager' | 'Supervisor' | 'Repositor';
}
