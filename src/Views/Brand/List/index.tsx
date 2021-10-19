import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '~/Contexts/TeamContext';

import { createBrand, getAllBrands } from '~/Functions/Brand';

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
    const { navigate } = useNavigation();

    const teamContext = useTeam();

    const [brands, setBrands] = useState<Array<IBrand>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [newBrandName, setNewBrandName] = useState<string | undefined>();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            if (teamContext.id) {
                const response = await getAllBrands({
                    team_id: teamContext.id,
                });

                setBrands(response);
            }
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
        setNewBrandName(value);
    }, []);

    const handleSaveBrand = useCallback(async () => {
        if (!teamContext.id) return;
        try {
            if (!newBrandName) {
                setInputHasError(true);
                setInputErrorMessage('Digite o nome da marca');
                return;
            }

            setIsAdding(true);

            const newBrand = await createBrand({
                brandName: newBrandName,
                team_id: teamContext.id,
            });

            setBrands([...brands, newBrand]);
            setNewBrandName('');
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsAdding(false);
        }
    }, [brands, newBrandName, teamContext.id]);

    const handleNavigateToCategory = useCallback(
        (brand_id: string) => {
            navigate('BrandView', {
                brand_id,
            });
        },
        [navigate]
    );

    const renderItem = useCallback(
        ({ item }) => {
            return (
                <ListItemContainer
                    onPress={() => handleNavigateToCategory(item.id)}
                >
                    <ListItemTitle>{item.name}</ListItemTitle>
                </ListItemContainer>
            );
        },
        [handleNavigateToCategory]
    );

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title="Marcas" />

            <AddNewItemContent>
                <InputContainer>
                    <InputTextContainer hasError={inputHasError}>
                        <InputText
                            value={newBrandName}
                            onChangeText={handleOnTextChange}
                            placeholder="Adicionar nova marca"
                        />
                    </InputTextContainer>

                    <AddButtonContainer
                        onPress={handleSaveBrand}
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

            <ListTitle>Todas as marcas</ListTitle>

            <List
                data={brands}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderItem}
            />
        </Container>
    );
};

export default ListView;
