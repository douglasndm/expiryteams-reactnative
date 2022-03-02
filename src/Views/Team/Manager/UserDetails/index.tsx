import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';
import { useAuth } from '~/Contexts/AuthContext';

import { removeUserFromTeam } from '~/Functions/Team/Users';
import { updateUserRole } from '~/Functions/User/Roles';
import { getAllStoresFromTeam } from '~/Functions/Team/Stores/AllStores';
import {
    addUserToStore,
    removeUserFromStore,
} from '~/Functions/Team/Stores/User';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import Loading from '~/Components/Loading';

import {
    PickerContainer,
    Picker,
} from '~/Components/Product/Inputs/Pickers/styles';

import {
    Container,
    PageHeader,
    PageTitleContainer,
    PageTitle,
    PageContent,
    UserName,
    UserInfo,
    CodeDetails,
    CodeTitle,
    CodeContainer,
    Code,
    ActionsButtonsContainer,
    ActionButton,
    Icon,
    RadioButtonContainer,
    RadioButton,
    RadioButtonText,
    RadioButtonContent,
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
    const { goBack, reset } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();

    const authContext = useAuth();
    const teamContext = useTeam();

    const user: IUserInTeam = useMemo(() => {
        return JSON.parse(String(route.params.user));
    }, [route.params.user]);

    const [stores, setStores] = useState<IPickerItem[]>([]);

    const [selectedRole, setSelectedRole] = useState<
        'repositor' | 'supervisor' | 'manager'
    >(() => {
        if (user.role) {
            const role = user.role.toLowerCase();

            if (role === 'manager') {
                return 'manager';
            }
            if (role === 'supervisor') {
                return 'supervisor';
            }
        }
        return 'repositor';
    });

    const [selectedStore, setSelectedStore] = useState<string | null>(() => {
        if (user.stores.length > 0) {
            return user.stores[0].id;
        }
        return null;
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        if (!teamContext.id) return;
        try {
            setIsLoading(true);

            const allStores = await getAllStoresFromTeam({
                team_id: teamContext.id,
            });

            const storesToAdd: IPickerItem[] = [];
            allStores.forEach(store => {
                storesToAdd.push({
                    key: store.id,
                    value: store.id,
                    label: store.name,
                });
            });

            setStores(storesToAdd);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [teamContext.id]);

    const handleOnChange = useCallback(value => {
        setSelectedStore(value);
    }, []);

    const enableManagerTools = useMemo(() => {
        if (teamContext.id) {
            if (teamContext.roleInTeam?.role.toLowerCase() === 'manager') {
                return true;
            }
        }
        return false;
    }, [teamContext.id, teamContext.roleInTeam]);

    const userIsPending = useMemo(() => {
        if (user.status) {
            if (user.status.toLowerCase() === 'pending') {
                return true;
            }
        }
        return false;
    }, [user.status]);

    const userRole = useMemo(() => {
        if (user.role) {
            const { role } = user;

            if (role?.toLowerCase() === 'manager')
                return strings.UserInfo_Role_Manager;
            if (role?.toLowerCase() === 'supervisor') {
                return strings.UserInfo_Role_Supervisor;
            }
        }

        return strings.UserInfo_Role_Repositor;
    }, [user]);

    const handleCopyCode = useCallback(() => {
        Clipboard.setString(user.code);

        showMessage({
            message: 'Código copiado para área de transferencia',
            type: 'info',
        });
    }, [user.code]);

    const handleRemoveUser = useCallback(async () => {
        if (!teamContext.id) {
            return;
        }

        try {
            setIsLoading(true);
            await removeUserFromTeam({
                team_id: teamContext.id,
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
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [reset, teamContext.id, user.id]);

    const handleUpdate = useCallback(async () => {
        if (!teamContext.id) return;

        try {
            setIsLoading(true);
            if (user.stores.length > 0) {
                if (selectedStore === null) {
                    await removeUserFromStore({
                        team_id: teamContext.id,
                        user_id: user.uuid,
                    });
                }
            }

            if (selectedStore !== null) {
                await addUserToStore({
                    team_id: teamContext.id,
                    user_id: user.uuid,
                    store_id: selectedStore,
                });
            }

            await updateUserRole({
                user_id: user.id,
                team_id: teamContext.id,
                newRole: selectedRole,
            });

            showMessage({
                message: 'Usuário atualizado',
                type: 'info',
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [
        selectedRole,
        selectedStore,
        teamContext.id,
        user.id,
        user.stores,
        user.uuid,
    ]);

    useEffect(() => {
        loadData();
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <StatusBar />

            <PageHeader>
                <PageTitleContainer>
                    <BackButton handleOnPress={goBack} />
                    <PageTitle>{strings.View_UserDetails_PageTitle}</PageTitle>
                </PageTitleContainer>

                {enableManagerTools &&
                    authContext.user &&
                    user.id !== authContext.user.uid && (
                        <ActionsButtonsContainer>
                            {!userIsPending && (
                                <ActionButton
                                    icon={() => (
                                        <Icon name="save-outline" size={22} />
                                    )}
                                    onPress={handleUpdate}
                                >
                                    Atualizar
                                </ActionButton>
                            )}
                            <ActionButton
                                icon={() => (
                                    <Icon
                                        name="person-remove-outline"
                                        size={22}
                                    />
                                )}
                                onPress={handleRemoveUser}
                            >
                                Remover
                            </ActionButton>
                        </ActionsButtonsContainer>
                    )}
            </PageHeader>

            <PageContent>
                {!!user.name && !!user.lastName && (
                    <UserName>{`${user.name} ${user.lastName}`}</UserName>
                )}

                <UserInfo>{user.email}</UserInfo>
                <UserInfo>{userRole}</UserInfo>

                {userIsPending && enableManagerTools && (
                    <CodeDetails>
                        <CodeTitle>
                            {strings.View_UserDetails_Code_Title}
                        </CodeTitle>
                        <CodeContainer onPress={handleCopyCode}>
                            <Code>{user.code}</Code>
                        </CodeContainer>
                    </CodeDetails>
                )}

                {enableManagerTools &&
                    authContext.user &&
                    user.id !== authContext.user.uid &&
                    !userIsPending && (
                        <>
                            <PickerContainer style={{ marginTop: 10 }}>
                                <Picker
                                    items={stores}
                                    onValueChange={handleOnChange}
                                    value={selectedStore}
                                    placeholder={{
                                        label: 'Atribuir a uma loja',
                                        value: null,
                                    }}
                                />
                            </PickerContainer>

                            <RadioButtonContainer>
                                <RadioButtonContent>
                                    <RadioButton
                                        value="checked"
                                        status={
                                            selectedRole === 'repositor'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() =>
                                            setSelectedRole('repositor')
                                        }
                                    />
                                    <RadioButtonText>Repositor</RadioButtonText>
                                </RadioButtonContent>

                                <RadioButtonContent>
                                    <RadioButton
                                        value="unchecked"
                                        status={
                                            selectedRole === 'supervisor'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() =>
                                            setSelectedRole('supervisor')
                                        }
                                    />
                                    <RadioButtonText>
                                        Supervisor
                                    </RadioButtonText>
                                </RadioButtonContent>
                            </RadioButtonContainer>
                        </>
                    )}
            </PageContent>
        </Container>
    );
};

export default UserDetails;
