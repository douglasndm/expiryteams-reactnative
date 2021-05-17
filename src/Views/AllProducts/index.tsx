import React, { useState, useEffect, useCallback, useContext } from 'react';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getAllProducts } from '~/Functions/Products/Products';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';

import {
    InputSearch,
    InputTextContainer,
    InputTextIconContainer,
    InputTextIcon,
} from '../Home/styles';

import { Container } from './styles';

const AllProducts: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const allProducts = await getAllProducts({
                team_id: userPreferences.selectedTeam.team.id,
            });

            if ('error' in allProducts) {
                showMessage({
                    message: allProducts.error,
                    type: 'danger',
                });
                return;
            }

            setProducts(allProducts);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [userPreferences.selectedTeam.team.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setProductsSearch(products);
    }, [products]);

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const handleSearchChange = useCallback(
        async (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const findProducts = searchForAProductInAList({
                    products,
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
                <>
                    <Container>
                        <Header
                            title={translate('View_AllProducts_PageTitle')}
                        />

                        {products.length > 0 && (
                            <InputTextContainer>
                                <InputSearch
                                    placeholder={translate(
                                        'View_AllProducts_SearchPlaceholder'
                                    )}
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

                        <ListProducts products={productsSearch} />
                    </Container>
                </>
            )}
        </>
    );
};

export default AllProducts;
