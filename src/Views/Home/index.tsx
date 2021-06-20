import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllProducts } from '~/Functions/Products/Products';
import { searchProducts } from '~/Functions/Products/Search';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';

import {
    Container,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
} from './styles';

const Home: React.FC = () => {
    const { reset } = useNavigation();

    const teamContext = useTeam();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    const getProduts = useCallback(async () => {
        if (teamContext.isLoading) {
            return;
        }
        try {
            setIsLoading(true);

            if (!teamContext.id) {
                reset({
                    routes: [
                        {
                            name: 'TeamList',
                        },
                    ],
                });
                return;
            }

            const productsResponse = await getAllProducts({
                team_id: teamContext.id,
            });

            setProducts(productsResponse);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });

            if (
                err.message.includes("Team doesn't have an active subscription")
            ) {
                reset({
                    routes: [
                        {
                            name: 'ViewTeam',
                        },
                    ],
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [reset, teamContext.id, teamContext.isLoading]);

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
                const findProducts = await searchProducts({
                    products,
                    query: search,
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
                    {/* <Header title={preferences.selectedTeam.team.name} /> */}
                    <Header title="Beta 01" />

                    {products.length > 0 && (
                        <InputTextContainer>
                            <InputSearch
                                placeholder={strings.View_Home_SearchText}
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

                    <ListProducts
                        products={productsSearch}
                        onRefresh={getProduts}
                    />
                </Container>
            )}
        </>
    );
};

export default Home;
