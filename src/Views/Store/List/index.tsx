import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { getAllStores } from '~/Functions/Store';

import Header from '~/Components/Header';

import {
    Container,
    ListCategories,
    CategoryItemContainer,
    CategoryItemTitle,
} from './styles';

const List: React.FC = () => {
    const { navigate } = useNavigation();

    const [stores, setStores] = useState<Array<string>>([]);
    useEffect(() => {
        getAllStores().then((response) => {
            setStores([...response, 'Sem loja']);
        });
    }, []);

    const handleNavigateToCategory = useCallback(
        (storeName: string) => {
            navigate('StoreDetails', {
                storeName,
            });
        },
        [navigate]
    );

    const renderCategory = useCallback(
        ({ item }) => {
            return (
                <CategoryItemContainer
                    onPress={() => handleNavigateToCategory(item)}
                >
                    <CategoryItemTitle>{item}</CategoryItemTitle>
                </CategoryItemContainer>
            );
        },
        [handleNavigateToCategory]
    );

    return (
        <Container>
            <Header title={translate('View_Store_List_PageTitle')} />

            <ListCategories
                data={stores}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderCategory}
            />
        </Container>
    );
};

export default List;
