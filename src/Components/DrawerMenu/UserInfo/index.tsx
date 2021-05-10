import React, { useCallback, useEffect, useState } from 'react';

import { translate } from '~/Locales';

import { getUserSession } from '~/Functions/Auth/Login';

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
    const [user, setUser] = useState<IUser | null>(null);

    const loadData = useCallback(async () => {
        const currentSession = await getUserSession();

        if (currentSession && currentSession.user) {
            setUser(currentSession.user);
        }
    }, []);

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

                        <UserLabel>
                            {translate('Menu_UserInfo_Role_Manager')}
                        </UserLabel>
                    </TextContainer>
                </>
            )}
        </Container>
    );
};

export default UserInfo;
