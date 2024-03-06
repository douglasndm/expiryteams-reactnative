import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
	createContext,
	ReactNode,
} from 'react';

import {
	getSelectedTeam,
	clearSelectedteam,
} from '@teams/Functions/Team/SelectedTeam';

interface ITeamContext {
	name: string | null;
	active: boolean | null;
	roleInTeam: {
		role: 'repositor' | 'supervisor' | 'manager';
		status: 'pending' | 'completed' | null;
		store: {
			id: string;
			name: string;
		} | null;
	} | null;
	reload: () => void;
	clearTeam: () => void;
	isLoading: boolean;
}

const TeamContext = createContext<Partial<ITeamContext>>({});

interface TeamProviderProps {
	children: ReactNode;
}

const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
	const [name, setName] = useState<ITeamContext['name']>(null);
	const [active, setActive] = useState<ITeamContext['active']>(null);
	const [roleInTeam, setRoleInTeam] =
		useState<ITeamContext['roleInTeam']>(null);

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

	const contextValue = useMemo(
		() => ({
			name,
			active,
			roleInTeam,
			reload,
			isLoading,
			clearTeam,
		}),
		[name, active, roleInTeam, reload, isLoading, clearTeam]
	);

	return (
		<TeamContext.Provider value={contextValue}>
			{children}
		</TeamContext.Provider>
	);
};

function useTeam(): Partial<ITeamContext> {
	const context = useContext(TeamContext);

	return context;
}

export { TeamProvider, useTeam };
