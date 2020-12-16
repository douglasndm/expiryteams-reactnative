import React, { useCallback, useEffect, useState } from 'react';

import { getUser } from '../../../Functions/Auth/Google';

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
    const [user, setUser] = useState<IGoogleUser | null>(null);

    const loadData = useCallback(async () => {
        const currentUser = await getUser();

        setUser(currentUser);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container>
            {user?.photo ? (
                <UserPhoto source={{ uri: user?.photo }} />
            ) : (
                <DefaultUserPhoto />
            )}

            <TextContainer>
                <UserName>{user?.name}</UserName>
                <UserEmail>{user?.email}</UserEmail>
                <UserLabel>USUÁRIO PRO</UserLabel>
            </TextContainer>
        </Container>
    );
};

export default UserInfo;
