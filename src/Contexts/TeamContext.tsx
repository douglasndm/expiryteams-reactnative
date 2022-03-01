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
} from '~/Functions/Team/SelectedTeam';

interface TeamContextData {
    id: string | null;
    name: string | null;
    active: boolean | null;
    roleInTeam: {
        role: 'repositor' | 'supervisor' | 'manager';
        status: 'pending' | 'completed';
    } | null;
    reload: () => void;
    clearTeam: () => void;
    isLoading: boolean;
}

const TeamContext = createContext<Partial<TeamContextData>>({});

const TeamProvider: React.FC = ({ children }: any) => {
    const [id, setId] = useState<string | null>(null);
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
            setId(response.team.id);
            setName(response.team.name);
            setActive(response.team.isActive);
            setRoleInTeam({
                role: response.role,
                status: response.status,
            });
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        reloadTeam();
    }, [reloadTeam]);

    const reload = useCallback(() => {
        setIsLoading(true);
        reloadTeam();
    }, [reloadTeam]);

    const clearTeam = useCallback(async () => {
        Promise.all([
            await clearSelectedteam(),
            setId(null),
            setName(null),
            setActive(null),
            setRoleInTeam(null),
        ]);
    }, []);

    return (
        <TeamContext.Provider
            value={{
                id,
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
