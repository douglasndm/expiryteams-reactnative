import React, {
    useState,
    useCallback,
    useEffect,
    useContext,
    useMemo,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getAllUsersFromTeam, putUserInTeam } from '~/Functions/Team/Users';

import PreferenceContext from '~/Contexts/PreferencesContext';

import Header from '~/Components/Header';
import Loading from '~/Components/Loading';

import {
    Container,
    InputContainer,
    InputTextContainer,
    InputText,
    ListCategories,
    ListTitle,
    TeamItemContainer,
    UserInfoContainer,
    TeamItemTitle,
    UserEmail,
    TeamItemRole,
    AddCategoryContent,
    AddCategoryButtonContainer,
    Icons,
    LoadingIcon,
    InputTextTip,
} from './styles';

const ListUsers: React.FC = () => {
    const { navigate } = useNavigation();

    const { preferences } = useContext(PreferenceContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const role = useMemo(() => {
        if (preferences.selectedTeam) {
            return preferences.selectedTeam.role.toLowerCase();
        }
        return 'repositor';
    }, [preferences.selectedTeam]);

    const [newUserEmail, setNewUserEmail] = useState<string | undefined>();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const [users, setUsers] = useState<Array<IUserInTeam>>([]);

    const loadData = useCallback(async () => {
        if (!preferences.selectedTeam) {
            showMessage({
                message: 'Team is not selected',
                type: 'danger',
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await getAllUsersFromTeam({
                team_id: preferences.selectedTeam.team.id,
            });

            if ('error' in response) {
                showMessage({
                    message: response.error,
                    type: 'danger',
                });
                return;
            }

            setUsers(response);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [preferences.selectedTeam]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOnTextChange = useCallback(value => {
        setInputHasError(false);
        setInputErrorMessage('');
        setNewUserEmail(value);
    }, []);

    const handleAddUser = useCallback(async () => {
        if (!preferences.selectedTeam) {
            showMessage({
                message: 'Team is not selected',
                type: 'danger',
            });
            return;
        }

        try {
            if (!newUserEmail) {
                setInputHasError(true);
                setInputErrorMessage(
                    translate(
                        'View_UsersInTeam_List_InputEmail_Error_EmptyText'
                    )
                );
                return;
            }
            setIsAdding(true);

            const userInTeam = await putUserInTeam({
                user_email: newUserEmail,
                team_id: preferences.selectedTeam.team.id,
            });

            const newUser: IUserInTeam = {
                id: userInTeam.user.firebaseUid,
                name: userInTeam.user.name,
                lastName: userInTeam.user.lastName,
                email: userInTeam.user.email,
                role: userInTeam.role,
                code: userInTeam.code,
                status: 'Pending',
            };

            setUsers([...users, newUser]);
            setNewUserEmail('');

            showMessage({
                message: `Usuário convidado!`,
                description: `Informe o código ${newUser.code} para o usuário entrar no time`,
                type: 'info',
            });
            navigate('UserDetails', { user: JSON.stringify(newUser) });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsAdding(false);
        }
    }, [newUserEmail, users, preferences.selectedTeam, navigate]);

    const handleNavigateToUser = useCallback(
        (user: IUserInTeam) => {
            navigate('UserDetails', { user: JSON.stringify(user) });
        },
        [navigate]
    );

    interface renderProps {
        item: IUserInTeam;
    }

    const renderCategory = useCallback(
        ({ item }: renderProps) => {
            const isPending =
                !!item.status && item.status.toLowerCase() === 'pending';

            return (
                <TeamItemContainer
                    onPress={() => handleNavigateToUser(item)}
                    isPending={isPending}
                >
                    <UserInfoContainer>
                        <TeamItemRole>
                            {isPending
                                ? translate(
                                      'View_UsersInTeam_List_PendingStatus'
                                  )
                                : item.role.toUpperCase()}
                        </TeamItemRole>
                        {!!item.name && (
                            <TeamItemTitle>{item.name}</TeamItemTitle>
                        )}

                        <UserEmail>{item.email}</UserEmail>
                    </UserInfoContainer>
                </TeamItemContainer>
            );
        },
        [handleNavigateToUser]
    );

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <Container>
                    <Header title={translate('View_UsersInTeam_PageTitle')} />

                    {role === 'manager' && (
                        <AddCategoryContent>
                            <InputContainer>
                                <InputTextContainer hasError={inputHasError}>
                                    <InputText
                                        value={newUserEmail}
                                        onChangeText={handleOnTextChange}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholder={translate(
                                            'View_UsersInTeam_Input_AddNewUser_Placeholder'
                                        )}
                                    />
                                </InputTextContainer>

                                <AddCategoryButtonContainer
                                    onPress={handleAddUser}
                                    enabled={!isAdding}
                                >
                                    {isAdding ? (
                                        <LoadingIcon />
                                    ) : (
                                        <Icons name="add-circle-outline" />
                                    )}
                                </AddCategoryButtonContainer>
                            </InputContainer>

                            {!!inputErrorMessage && (
                                <InputTextTip>{inputErrorMessage}</InputTextTip>
                            )}
                        </AddCategoryContent>
                    )}

                    <ListTitle>
                        {translate('View_UsersInTeam_List_Title')}
                    </ListTitle>

                    <ListCategories
                        data={users}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={renderCategory}
                    />
                </Container>
            )}
        </>
    );
};

export default ListUsers;
