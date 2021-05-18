import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getAllUsersFromTeam } from '~/Functions/Team/Users';

import PreferenceContext from '~/Contexts/PreferencesContext';

import Header from '~/Components/Header';

import {
    Container,
    InputContainer,
    InputTextContainer,
    InputText,
    ListCategories,
    ListTitle,
    TeamItemContainer,
    TeamItemTitle,
    TeamItemRole,
    AddCategoryContent,
    AddCategoryButtonContainer,
    Icons,
    LoadingIcon,
    InputTextTip,
} from './styles';

const ListUsers: React.FC = () => {
    const { navigate } = useNavigation();

    const { userPreferences } = useContext(PreferenceContext);

    const [newuserName, setNewUserName] = useState<string | undefined>();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const [users, setUsers] = useState<Array<IUserInTeam>>([]);

    const loadData = useCallback(async () => {
        try {
            const response = await getAllUsersFromTeam({
                team_id: userPreferences.selectedTeam.team.id,
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
        }
    }, [userPreferences.selectedTeam.team.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOnTextChange = useCallback(value => {
        setInputHasError(false);
        setInputErrorMessage('');
        setNewUserName(value);
    }, []);

    const handleSaveCategory = useCallback(async () => {
        try {
            // if (!newuserName) {
            //     setInputHasError(true);
            //     setInputErrorMessage(
            //         translate('View_Category_List_InputAdd_Error_EmptyText')
            //     );
            //     return;
            // }
            // setIsAdding(true);
            // const newCategory = await createCategory({
            //     name: newCategoryName,
            //     team_id: userPreferences.selectedTeam.team.id,
            // });
            // if ('error' in newCategory) {
            //     setInputErrorMessage(newCategory.error);
            //     return;
            // }
            // setCategories([...categories, newCategory]);
            // setNewCategoryName('');
        } catch (err) {
            setInputErrorMessage(err.message);
        } finally {
            setIsAdding(false);
        }
    }, [newuserName, users, userPreferences.selectedTeam.team.id]);

    const handleNavigateToUser = useCallback((id: string) => {}, []);

    interface renderProps {
        item: IUserInTeam;
    }

    const renderCategory = useCallback(
        ({ item }: renderProps) => {
            return (
                <TeamItemContainer
                    onPress={() => handleNavigateToUser(item.id)}
                >
                    <TeamItemTitle>{item.name}</TeamItemTitle>
                    <TeamItemRole>{item.role.toUpperCase()}</TeamItemRole>
                </TeamItemContainer>
            );
        },
        [handleNavigateToUser]
    );

    return (
        <Container>
            <Header title={translate('View_UsersInTeam_PageTitle')} />

            {userPreferences.selectedTeam.role.toLowerCase() === 'manager' && (
                <AddCategoryContent>
                    <InputContainer>
                        <InputTextContainer hasError={inputHasError}>
                            <InputText
                                value={newuserName}
                                onChangeText={handleOnTextChange}
                                placeholder={translate(
                                    'View_UsersInTeam_Input_AddNewUser_Placeholder'
                                )}
                            />
                        </InputTextContainer>

                        <AddCategoryButtonContainer
                            onPress={handleSaveCategory}
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

            <ListTitle>{translate('View_UsersInTeam_List_Title')}</ListTitle>

            <ListCategories
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderCategory}
            />
        </Container>
    );
};

export default ListUsers;
