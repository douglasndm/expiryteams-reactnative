import React, { useCallback, useEffect, useMemo, useState } from 'react';

import strings from '~/Locales';

import { useAuth } from '~/Contexts/AuthContext';
import { useTeam } from '~/Contexts/TeamContext';

import { getUser } from '~/Functions/User';

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
    const { user: firebaseUser } = useAuth();
    const teamContext = useTeam();

    const [user, setUser] = useState<IUser | null>(null);

    const loadData = useCallback(async () => {
        if (firebaseUser) {
            const ownUser = await getUser({ user_id: firebaseUser.uid });

            if (ownUser) {
                setUser({
                    firebaseUid: firebaseUser.uid,
                    email: ownUser.email,
                    name: ownUser.name,
                    lastName: ownUser?.email,
                });
            } else {
                setUser(null);
            }
        }
    }, [firebaseUser]);

    const userRole = useMemo(() => {
        if (teamContext.roleInTeam) {
            const { role } = teamContext.roleInTeam;

            if (role?.toLowerCase() === 'manager')
                return strings.UserInfo_Role_Manager;
            if (role?.toLowerCase() === 'supervisor') {
                return strings.UserInfo_Role_Supervisor;
            }
        }

        return strings.UserInfo_Role_Repositor;
    }, [teamContext.roleInTeam]);

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

                        {!!teamContext.name && (
                            <UserInfo>
                                {`${
                                    teamContext.name
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
