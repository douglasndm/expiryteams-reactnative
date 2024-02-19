interface IUser {
	id: string;
	name?: string | null;
	lastName?: string | null;
	email: string;
	password?: string;
	firebaseUid: string;
}

interface IUserInTeam {
	id: string;
	fid: string;
	name?: string | null;
	lastName?: string | null;
	email: string;
	role: string;
	code: string;
	status: 'Completed' | 'Pending';
	store: IStore | null;
}
