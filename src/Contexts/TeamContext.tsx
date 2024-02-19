import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	createContext,
} from 'react';

import {
	getSelectedTeam,
	clearSelectedteam,
} from '@teams/Functions/Team/SelectedTeam';

interface TeamContextData {
	name: string | null;
	active: boolean | null;
	roleInTeam: {
		role: 'repositor' | 'supervisor' | 'manager';
		status: 'pending' | 'completed';
		store: {
			id: string;
			name: string;
		} | null;
	} | null;
	reload: () => void;
	clearTeam: () => void;
	isLoading: boolean;
}

const TeamContext = createContext<Partial<TeamContextData>>({});

const TeamProvider: React.FC = ({ children }: any) => {
	const [name, setName] = useState<string | null>(null);
	const [active, setActive] = useState<boolean | null>(null);

	const [roleInTeam, setRoleInTeam] = useState<{
		role: 'repositor' | 'supervisor' | 'manager';
		status: 'pending' | 'completed';
	} | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const reloadTeam = useCallback(async () => {
		const response = await getSelectedTeam();

		if (response) {
			const { team, role, status } = response.userRole;

			setName(team.name);
			setActive(team.isActive);
			setRoleInTeam({
				role,
				status,
				store: response.userRole.store,
			});
		}

		setIsLoading(false);
	}, []);

	useEffect(() => {
		reloadTeam();
	}, []);

	const reload = useCallback(() => {
		setIsLoading(true);
		reloadTeam();
	}, [reloadTeam]);

	const clearTeam = useCallback(async () => {
		Promise.all([
			await clearSelectedteam(),
			setName(null),
			setActive(null),
			setRoleInTeam(null),
		]);
	}, []);

	return (
		<TeamContext.Provider
			value={{
				name,
				active,
				roleInTeam,
				reload,
				isLoading,
				clearTeam,
			}}
		>
			{children}
		</TeamContext.Provider>
	);
};

function useTeam(): Partial<TeamContextData> {
	const context = useContext(TeamContext);

	return context;
}

export { TeamProvider, useTeam };
