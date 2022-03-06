import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { FlatList } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { getAllProducts } from '~/Functions/Products/Products';
import { searchProducts } from '~/Functions/Products/Search';
import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

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
    const teamContext = useTeam();

    const listRef = useRef<FlatList<IProduct>>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    const getProduts = useCallback(async () => {
        try {
            setIsLoading(true);

            const selectedTeam = await getSelectedTeam();

            if (!selectedTeam) {
                return;
            }

            const productsResponse = await getAllProducts({
                team_id: selectedTeam.team.id,
            });

            setProducts(productsResponse);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            getProduts();
        }

        return () => {
            setIsMounted(false);
        };
    }, [getProduts, isMounted]);

    useEffect(() => {
        if (isMounted) {
            setProductsSearch(products);
        }
    }, [isMounted, products]);

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
                    {teamContext.name && (
                        <Header title={teamContext.name} listRef={listRef} />
                    )}

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
                        sortProdsByBatchExpDate={false}
                        listRef={listRef}
                    />
                </Container>
            )}
        </>
    );
};

export default memo(Home);
