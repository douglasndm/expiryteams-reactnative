import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    UserName,
    UserInfo,
    CodeDetails,
    CodeTitle,
    CodeContainer,
    Code,
} from './styles';

interface UserDetailsProps {
    route: {
        params: {
            user: IUserInTeam;
        };
    };
}

const UserDetails: React.FC<UserDetailsProps> = ({
    route,
}: UserDetailsProps) => {
    const { goBack } = useNavigation();

    const user: IUserInTeam = useMemo(() => {
        return JSON.parse(route.params.user);
    }, [route.params.user]);

    const userRole = useMemo(() => {
        if (user.role) {
            const { role } = user;

            if (role?.toLowerCase() === 'manager')
                return translate('UserInfo_Role_Manager');
            if (role?.toLowerCase() === 'supervisor') {
                return translate('UserInfo_Role_Supervisor');
            }
        }

        return translate('UserInfo_Role_Repositor');
    }, [user]);

    return (
        <Container>
            <StatusBar />

            <PageHeader>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{translate('View_UserDetails_PageTitle')}</PageTitle>
            </PageHeader>

            <PageContent>
                <UserName>{`${user.name} ${user.lastName}`}</UserName>
                <UserInfo>{user.email}</UserInfo>
                <UserInfo>{userRole}</UserInfo>

                {!!user.status &&
                    user.status.toLowerCase() === 'pending' &&
                    user.role.toLowerCase() === 'manager' && (
                        <CodeDetails>
                            <CodeTitle>
                                {translate('View_UserDetails_Code_Title')}
                            </CodeTitle>
                            <CodeContainer>
                                <Code>{user.code}</Code>
                            </CodeContainer>
                        </CodeDetails>
                    )}
            </PageContent>
        </Container>
    );
};

export default UserDetails;
