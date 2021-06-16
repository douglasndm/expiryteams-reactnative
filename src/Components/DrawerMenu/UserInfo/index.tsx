import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    TextContainer,
    UserName,
    UserEmail,
    UserInfo,
    UserPhoto,
    DefaultUserPhoto,
} from './styles';

interface InfoProps {
    navigate: (route: string) => void;
}

const Info: React.FC<InfoProps> = ({ navigate }: InfoProps) => {
    const { preferences } = useContext(PreferencesContext);

    const [user, setUser] = useState<IUser | null>(null);

    const loadData = useCallback(async () => {
        if (preferences.user !== null) {
            setUser(preferences.user);
            return;
        }
        setUser(null);
    }, [preferences.user]);

    const userRole = useMemo(() => {
        if (preferences.selectedTeam) {
            const { role } = preferences.selectedTeam;

            if (role?.toLowerCase() === 'manager')
                return strings.UserInfo_Role_Manager;
            if (role?.toLowerCase() === 'supervisor') {
                return strings.UserInfo_Role_Supervisor;
            }
        }

        return strings.UserInfo_Role_Repositor;
    }, [preferences.selectedTeam]);

    const name = useMemo(() => {
        if (user) {
            if (user.name && user.lastName) {
                return `${user.name} ${user.lastName}`;
            }
            if (user.name) {
                return user.name;
            }
        }
        return null;
    }, [user]);

    const handleNavigateToProfile = useCallback(() => {
        navigate('User');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container onPress={handleNavigateToProfile}>
            {user && (
                <>
                    {user?.photo ? (
                        <UserPhoto source={{ uri: user?.photo }} />
                    ) : (
                        <DefaultUserPhoto />
                    )}

                    <TextContainer>
                        {!!name && <UserName>{name}</UserName>}

                        <UserEmail>{user?.email}</UserEmail>

                        {!!preferences.selectedTeam && (
                            <UserInfo>
                                {`${
                                    preferences.selectedTeam.team.name
                                } (${userRole.toUpperCase()})`}
                            </UserInfo>
                        )}
                    </TextContainer>
                </>
            )}
        </Container>
    );
};

export default Info;
