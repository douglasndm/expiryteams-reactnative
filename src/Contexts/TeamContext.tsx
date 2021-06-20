import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    createContext,
} from 'react';

import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

interface TeamContextData {
    id: string | null;
    name: string | null;
    active: boolean | null;
    roleInTeam: {
        role: 'repositor' | 'supervisor' | 'manager';
        status: 'pending' | 'completed';
    } | null;
    reload: () => void;
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
            setActive(response.team.active);
            setRoleInTeam({
                role: response.role,
                status: response.status,
            });
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        reloadTeam();
    }, []);

    const reload = useCallback(() => {
        reloadTeam();
    }, []);

    return (
        <TeamContext.Provider
            value={{ id, name, active, roleInTeam, reload, isLoading }}
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
