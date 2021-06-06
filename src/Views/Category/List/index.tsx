import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import {
    getAllCategoriesFromTeam,
    createCategory,
} from '~/Functions/Categories';

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
    CategoryItemContainer,
    CategoryItemTitle,
    AddCategoryContent,
    AddCategoryButtonContainer,
    Icons,
    LoadingIcon,
    InputTextTip,
} from './styles';

const List: React.FC = () => {
    const { navigate } = useNavigation();

    const { preferences } = useContext(PreferenceContext);

    const [isLoading, setIsLoading] = useState(true);

    const [newCategoryName, setNewCategoryName] = useState<
        string | undefined
    >();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const [categories, setCategories] = useState<Array<ICategory>>([]);

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

            const response = await getAllCategoriesFromTeam({
                team_id: preferences.selectedTeam.team.id,
            });

            setCategories(response);
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
        setNewCategoryName(value);
    }, []);

    const handleSaveCategory = useCallback(async () => {
        if (!preferences.selectedTeam) {
            return;
        }

        try {
            if (!newCategoryName) {
                setInputHasError(true);
                setInputErrorMessage(
                    translate('View_Category_List_InputAdd_Error_EmptyText')
                );
                return;
            }

            setIsAdding(true);

            const newCategory = await createCategory({
                name: newCategoryName,
                team_id: preferences.selectedTeam.team.id,
            });

            setCategories([...categories, newCategory]);
            setNewCategoryName('');
        } catch (err) {
            setInputErrorMessage(err.message);
        } finally {
            setIsAdding(false);
        }
    }, [newCategoryName, categories, preferences.selectedTeam]);

    const handleNavigateToCategory = useCallback(
        (categoryId: string, category_name?: string) => {
            navigate('CategoryView', {
                category_id: categoryId,
                category_name,
            });
        },
        [navigate]
    );

    const renderCategory = useCallback(
        ({ item }) => {
            return (
                <CategoryItemContainer
                    onPress={() => handleNavigateToCategory(item.id, item.name)}
                >
                    <CategoryItemTitle>{item.name}</CategoryItemTitle>
                </CategoryItemContainer>
            );
        },
        [handleNavigateToCategory]
    );
    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title={translate('View_Category_List_PageTitle')} />

            {!!preferences.selectedTeam &&
                preferences.selectedTeam.role.toLowerCase() === 'manager' && (
                    <AddCategoryContent>
                        <InputContainer>
                            <InputTextContainer hasError={inputHasError}>
                                <InputText
                                    value={newCategoryName}
                                    onChangeText={handleOnTextChange}
                                    placeholder={translate(
                                        'View_Category_List_InputAdd_Placeholder'
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

            <ListTitle>
                {translate('View_Category_List_AllCategories_Label')}
            </ListTitle>

            <ListCategories
                data={categories}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderCategory}
            />
        </Container>
    );
};

export default List;
