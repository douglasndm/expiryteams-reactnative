import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { createStore, getAllStores } from '~/Functions/Stores';

import Header from '~/Components/Header';

import {
    AddCategoryContent,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
    AddCategoryButtonContainer,
    LoadingIcon,
    Icons,
} from '~/Views/Category/List/styles';

import {
    Container,
    ListCategories,
    CategoryItemContainer,
    CategoryItemTitle,
} from './styles';

const List: React.FC = () => {
    const { navigate } = useNavigation();

    const [newStoreName, setNewStoreName] = useState<string | undefined>();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const [stores, setStores] = useState<Array<IStore>>([]);

    useEffect(() => {
        getAllStores().then(response => {
            const noStore: IStore = {
                id: '000',
                name: translate('View_Store_List_NoStore'),
            };

            setStores([...response, noStore]);
        });
    }, []);

    const handleOnTextChange = useCallback(value => {
        setInputHasError(false);
        setInputErrorMessage('');
        setNewStoreName(value);
    }, []);

    const handleSaveStore = useCallback(async () => {
        try {
            if (!newStoreName) {
                setInputHasError(true);
                setInputErrorMessage(
                    translate('View_Store_List_AddNewStore_Error_TextEmpty')
                );
                return;
            }

            setIsAdding(true);

            const newStore = await createStore(newStoreName);

            setStores([...stores, newStore]);
            setNewStoreName('');
        } catch (err) {
            setInputErrorMessage(err.message);
        } finally {
            setIsAdding(false);
        }
    }, [newStoreName, stores]);

    const handleNavigateToStore = useCallback(
        (store: IStore | string) => {
            navigate('StoreDetails', {
                store,
            });
        },
        [navigate]
    );

    const renderCategory = useCallback(
        ({ item }) => {
            let storeToNavigate: string;

            if (item.id) {
                storeToNavigate = item.id;
            } else if (!item.id && item.name) {
                storeToNavigate = item.name;
            } else {
                storeToNavigate = item;
            }

            return (
                <CategoryItemContainer
                    onPress={() => handleNavigateToStore(storeToNavigate)}
                >
                    <CategoryItemTitle>{item.name}</CategoryItemTitle>
                </CategoryItemContainer>
            );
        },
        [handleNavigateToStore]
    );

    return (
        <Container>
            <Header title={translate('View_Store_List_PageTitle')} />

            <AddCategoryContent>
                <InputContainer>
                    <InputTextContainer hasError={inputHasError}>
                        <InputText
                            value={newStoreName}
                            onChangeText={handleOnTextChange}
                            placeholder={translate(
                                'View_Store_List_AddNewStore_Placeholder'
                            )}
                        />
                    </InputTextContainer>

                    <AddCategoryButtonContainer
                        onPress={handleSaveStore}
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

            <ListCategories
                data={stores}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderCategory}
            />
        </Container>
    );
};

export default List;
