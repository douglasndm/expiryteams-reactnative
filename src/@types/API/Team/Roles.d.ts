interface Subscription {
	expireIn: Date;
	membersLimit: number;
	isActive: boolean;
}

interface IUserRoles {
	team: {
		id: string;
		name: string;
		isActive: boolean;
		subscriptions?: Subscription[];
	};
	status: 'pending' | 'completed' | null;
	role: 'manager' | 'supervisor' | 'repositor';
	store: {
		id: string;
		name: string;
	} | null;
}
