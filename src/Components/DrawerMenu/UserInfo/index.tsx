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
    UserLabel,
    UserPhoto,
    DefaultUserPhoto,
} from './styles';

const UserInfo: React.FC = () => {
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
                        <UserName>{`${user.name} ${user.lastName}`}</UserName>
                        <UserEmail>{user?.email}</UserEmail>

                        <UserLabel>{userRole}</UserLabel>
                    </TextContainer>
                </>
            )}
        </Container>
    );
};

export default UserInfo;
