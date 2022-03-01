interface IUser {
    id?: string;
    name?: string | null;
    lastName?: string | null;
    email: string;
    password?: string;
    firebaseUid: string;
}

interface IUserInTeam {
    uuid: string;
    id: string;
    name?: string | null;
    lastName?: string | null;
    email: string;
    role: string;
    stores: IStore[];
    code: string;
    status: 'Completed' | 'Pending';
}
