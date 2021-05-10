import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { getUserTeams } from '~/Functions/Team/Users';

import Header from '~/Components/Header';

import {
    Container,
    ListCategories,
    TeamItemContainer,
    TeamItemTitle,
    TeamItemRole,
} from './styles';

const List: React.FC = () => {
    const { navigate } = useNavigation();

    const [teams, setTeams] = useState<Array<IUserRoles>>([]);

    const loadData = useCallback(async () => {
        const response = await getUserTeams();

        if ('error' in response) {
            console.log(response.error);
            return;
        }

        setTeams(response);
    }, []);

    const handleNavigateToStore = useCallback(
        (store: IStore | string) => {
            navigate('StoreDetails', {
                store,
            });
        },
        [navigate]
    );

    interface renderProps {
        item: IUserRoles;
    }

    const renderCategory = useCallback(
        ({ item }: renderProps) => {
            const teamToNavigate = item.team.id;

            return (
                <TeamItemContainer
                    onPress={() => handleNavigateToStore(teamToNavigate)}
                >
                    <TeamItemTitle>{item.team.name}</TeamItemTitle>
                    <TeamItemRole>{item.role}</TeamItemRole>
                </TeamItemContainer>
            );
        },
        [handleNavigateToStore]
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container>
            <Header title={translate('View_Team_List_PageTitle')} />

            <ListCategories
                data={teams}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderCategory}
            />
        </Container>
    );
};

export default List;
