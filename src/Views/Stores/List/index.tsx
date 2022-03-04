import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllStoresFromTeam } from '~/Functions/Team/Stores/AllStores';
import { createStore } from '~/Functions/Team/Stores/Create';

import Header from '~/Components/Header';
import Loading from '~/Components/Loading';

import {
    Container,
    InputContainer,
    InputTextContainer,
    InputText,
    List,
    ListTitle,
    Icons,
    LoadingIcon,
    InputTextTip,
    ListItemContainer,
    ListItemTitle,
    AddButtonContainer,
    AddNewItemContent,
} from '~/Styles/Views/GenericListPage';

const ListView: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const teamContext = useTeam();

    const [stores, setStores] = useState<Array<IStore>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [newStoreName, setNewStoreName] = useState<string | undefined>();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const loadData = useCallback(async () => {
        if (!teamContext.id) return;
        try {
            setIsLoading(true);

            const response = await getAllStoresFromTeam({
                team_id: teamContext.id,
            });

            setStores(response);
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOnTextChange = useCallback(value => {
        setInputHasError(false);
        setInputErrorMessage('');
        setNewStoreName(value);
    }, []);

    const handleSave = useCallback(async () => {
        if (!teamContext.id) return;
        try {
            if (!newStoreName) {
                setInputHasError(true);
                setInputErrorMessage('Digite o nome da loja');
                return;
            }

            setIsAdding(true);

            const store = await createStore({
                name: newStoreName,
                team_id: teamContext.id,
            });

            setStores([...stores, store]);
            setNewStoreName('');
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsAdding(false);
        }
    }, [newStoreName, stores, teamContext.id]);

    const handleNavigateToStore = useCallback(
        (store_id: string, store_name: string) => {
            navigate('StoreView', {
                store_id,
                store_name,
            });
        },
        [navigate]
    );

    const renderItem = useCallback(
        ({ item }) => {
            return (
                <ListItemContainer
                    onPress={() => handleNavigateToStore(item.id, item.name)}
                >
                    <ListItemTitle>{item.name}</ListItemTitle>
                </ListItemContainer>
            );
        },
        [handleNavigateToStore]
    );

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title="Lojas" />

            <AddNewItemContent>
                <InputContainer>
                    <InputTextContainer hasError={inputHasError}>
                        <InputText
                            value={newStoreName}
                            onChangeText={handleOnTextChange}
                            placeholder="Adicionar nova loja"
                        />
                    </InputTextContainer>

                    <AddButtonContainer
                        onPress={handleSave}
                        enabled={!isAdding}
                    >
                        {isAdding ? (
                            <LoadingIcon />
                        ) : (
                            <Icons name="add-circle-outline" />
                        )}
                    </AddButtonContainer>
                </InputContainer>

                {!!inputErrorMessage && (
                    <InputTextTip>{inputErrorMessage}</InputTextTip>
                )}
            </AddNewItemContent>

            <ListTitle>Todas as lojas</ListTitle>

            <List
                data={stores}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderItem}
            />
        </Container>
    );
};

export default ListView;
