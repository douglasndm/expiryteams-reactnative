import React, { useCallback, useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

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

    const { userPreferences } = useContext(PreferencesContext);

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

    const handleCopyCode = useCallback(() => {
        Clipboard.setString(user.code);

        showMessage({
            message: 'Código copiado para área de transferencia',
            type: 'info',
        });
    }, [user.code]);

    return (
        <Container>
            <StatusBar />

            <PageHeader>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{translate('View_UserDetails_PageTitle')}</PageTitle>
            </PageHeader>

            <PageContent>
                {!!user.name && !!user.lastName && (
                    <UserName>{`${user.name} ${user.lastName}`}</UserName>
                )}

                <UserInfo>{user.email}</UserInfo>
                <UserInfo>{userRole}</UserInfo>

                {!!user.status &&
                    user.status.toLowerCase() === 'pending' &&
                    userPreferences.selectedTeam.role.toLowerCase() ===
                        'manager' && (
                        <CodeDetails>
                            <CodeTitle>
                                {translate('View_UserDetails_Code_Title')}
                            </CodeTitle>
                            <CodeContainer onPress={handleCopyCode}>
                                <Code>{user.code}</Code>
                            </CodeContainer>
                        </CodeDetails>
                    )}
            </PageContent>
        </Container>
    );
};

export default UserDetails;
