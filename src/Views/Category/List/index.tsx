import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { getAllCategories, createCategory } from '~/Functions/Category';

import Header from '~/Components/Header';

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

    const [newCategoryName, setNewCategoryName] = useState<
        string | undefined
    >();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const [categories, setCategories] = useState<Array<ICategory>>([]);

    useEffect(() => {
        getAllCategories().then((response) => setCategories(response));
    }, []);

    const handleOnTextChange = useCallback((value) => {
        setInputHasError(false);
        setInputErrorMessage('');
        setNewCategoryName(value);
    }, []);

    const handleSaveCategory = useCallback(async () => {
        try {
            if (!newCategoryName) {
                setInputHasError(true);
                setInputErrorMessage('Digite o nome da categoria');
                return;
            }

            setIsAdding(true);

            const newCategory = await createCategory(newCategoryName);

            setCategories([...categories, newCategory]);
            setNewCategoryName('');
        } catch (err) {
            setInputErrorMessage(err.message);
        } finally {
            setIsAdding(false);
        }
    }, [newCategoryName, categories]);

    const handleNavigateToCategory = useCallback(
        (categoryId: string) => {
            navigate('CategoryView', {
                id: categoryId,
            });
        },
        [navigate]
    );

    const renderCategory = useCallback(
        ({ item }) => {
            return (
                <CategoryItemContainer
                    onPress={() => handleNavigateToCategory(item.id)}
                >
                    <CategoryItemTitle>{item.name}</CategoryItemTitle>
                </CategoryItemContainer>
            );
        },
        [handleNavigateToCategory]
    );
    return (
        <Container>
            <Header title={translate('View_Category_List_PageTitle')} />

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

            <ListTitle>
                {translate('View_Category_List_AllCategories_Label')}
            </ListTitle>

            <ListCategories
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderCategory}
            />
        </Container>
    );
};

export default List;
