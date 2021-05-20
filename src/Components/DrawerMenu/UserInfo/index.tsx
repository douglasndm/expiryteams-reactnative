import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { translate } from '~/Locales';

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

const Info: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [user, setUser] = useState<IUser | null>(null);

    const loadData = useCallback(async () => {
        setUser(userPreferences.user);
    }, [userPreferences.user]);

    const userRole = useMemo(() => {
        if (userPreferences.selectedTeam) {
            const { role } = userPreferences.selectedTeam;

            if (role?.toLowerCase() === 'manager')
                return translate('UserInfo_Role_Manager');
            if (role?.toLowerCase() === 'supervisor') {
                return translate('UserInfo_Role_Supervisor');
            }
        }

        return translate('UserInfo_Role_Repositor');
    }, [userPreferences.selectedTeam]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container>
            {user && (
                <>
                    {user?.photo ? (
                        <UserPhoto source={{ uri: user?.photo }} />
                    ) : (
                        <DefaultUserPhoto />
                    )}

                    <TextContainer>
                        {!!user.name && (
                            <UserName>{`${user.name} ${user.lastName}`}</UserName>
                        )}

                        <UserEmail>{user?.email}</UserEmail>

                        <UserInfo>
                            {`${
                                userPreferences.selectedTeam.team.name
                            } (${userRole.toUpperCase()})`}
                        </UserInfo>
                    </TextContainer>
                </>
            )}
        </Container>
    );
};

export default Info;
