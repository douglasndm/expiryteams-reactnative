import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../Locales';

import Loading from '../../Components/Loading';
import Header from '../../Components/Header';
import ListProducts from '../../Components/ListProducts';
import BarCodeReader from '../../Components/BarCodeReader';
import Notification from '../../Components/Notification';

import {
    getAllProducts,
    searchForAProductInAList,
} from '../../Functions/Products';

import {
    InputSearch,
    InputTextContainer,
    InputTextIconContainer,
    InputTextIcon,
    FloatButton,
    Icons,
} from '../Home/styles';

import { Container } from './styles';

const AllProducts: React.FC = () => {
    const { navigate } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );
    const [error, setError] = useState<string>('');

    const getProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            const allProducts = await getAllProducts({
                sortProductsByExpDate: true,
            });

            setProducts(allProducts);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        setProductsSearch(products);
    }, [products]);

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct');
    }, [navigate]);

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
        (code) => {
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

                        {!!error && (
                            <Notification
                                NotificationMessage={error}
                                NotificationType="error"
                                onPress={handleDimissNotification}
                            />
                        )}
                    </Container>

                    <FloatButton
                        icon={() => (
                            <Icons name="add-outline" color="white" size={22} />
                        )}
                        small
                        label={translate('View_FloatMenu_AddProduct')}
                        onPress={handleNavigateAddProduct}
                    />
                </>
            )}
        </>
    );
};

export default AllProducts;
