import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { getAllProducts } from '~/Functions/Products/Products';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import Notification from '~/Components/Notification';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';

import {
    Container,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
} from './styles';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

const Home: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const { reset } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [error, setError] = useState<string>();

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    const getProduts = useCallback(async () => {
        try {
            setIsLoading(true);
            const productsResponse = await getAllProducts({
                team_id: userPreferences.selectedTeam.team.id,
            });

            if ('error' in productsResponse) {
                setError(productsResponse.error);

                if (productsResponse.status === 401) {
                    await logoutFirebase();

                    reset({
                        routes: [
                            {
                                name: 'Login',
                            },
                        ],
                    });
                }
                return;
            }

            setProducts(productsResponse);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        getProduts();
    }, [getProduts]);

    useEffect(() => {
        setProductsSearch(products);
    }, [products]);

    const handleSearchChange = useCallback(
        async (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const allProducts = await getAllProducts({});

                const findProducts = searchForAProductInAList({
                    products: allProducts,
                    searchFor: search,
                    sortByExpDate: true,
                });

                setProductsSearch(findProducts);
            } else {
                setProductsSearch(products);
            }
        },
        [products]
    );

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const handleOnCodeRead = useCallback(
        code => {
            setSearchString(code);
            handleSearchChange(code);
            setEnableBarCodeReader(false);
        },
        [handleSearchChange]
    );

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {enableBarCodeReader ? (
                <BarCodeReader
                    onCodeRead={handleOnCodeRead}
                    onClose={handleOnBarCodeReaderClose}
                />
            ) : (
                <Container>
                    <Header title={userPreferences.selectedTeam.team.name} />

                    {products.length > 0 && (
                        <InputTextContainer>
                            <InputSearch
                                placeholder={translate('View_Home_SearchText')}
                                value={searchString}
                                onChangeText={handleSearchChange}
                            />
                            <InputTextIconContainer
                                onPress={handleOnBarCodeReaderOpen}
                            >
                                <InputTextIcon name="barcode-outline" />
                            </InputTextIconContainer>
                        </InputTextContainer>
                    )}

                    <ListProducts products={productsSearch} isHome />

                    {!!error && (
                        <Notification
                            NotificationMessage={error}
                            NotificationType="error"
                            onPress={handleDimissNotification}
                        />
                    )}
                </Container>
            )}
        </>
    );
};

export default Home;
