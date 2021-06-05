import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { removeUserFromTeam } from '~/Functions/Team/Users';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import Loading from '~/Components/Loading';

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
    ActionButtonsContainer,
    Button,
    ButtonText,
    Icon,
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
    const { goBack, reset } = useNavigation();

    const { preferences } = useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const handleRemoveUser = useCallback(async () => {
        if (!preferences.selectedTeam) {
            return;
        }

        try {
            setIsLoading(true);
            await removeUserFromTeam({
                team_id: preferences.selectedTeam.team.id,
                user_id: user.id,
            });

            showMessage({
                message: 'Usuário removido do time',
                type: 'info',
            });

            reset({
                routes: [
                    { name: 'Home' },
                    { name: 'ViewTeam' },
                    { name: 'ListUsersFromTeam' },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [preferences.selectedTeam, reset, user.id]);

    return isLoading ? (
        <Loading />
    ) : (
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
                    preferences.selectedTeam.role.toLowerCase() ===
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

            <ActionButtonsContainer>
                {user.id !== preferences.user.uid && (
                    <Button onPress={handleRemoveUser}>
                        <Icon name="person-remove-outline" />
                        <ButtonText>Remover usuário</ButtonText>
                    </Button>
                )}
            </ActionButtonsContainer>
        </Container>
    );
};

export default UserDetails;
