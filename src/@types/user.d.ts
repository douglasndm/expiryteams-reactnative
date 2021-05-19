interface IUser {
    id: string;
    name: string;
    lastName: string;
    email: string;
    firebaseUid: string;
}

interface IUserInTeam {
    id: string;
    name: string;
    lastName: string;
    email: string;
    role: string;
    code: string;
    status: 'Completed' | 'Pending';
}
