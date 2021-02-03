import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from 'react';
import { Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getAllowedToReadIDFA } from '~/Functions/Privacy';
import { searchForAProductInAList, getAllProducts } from '~/Functions/Products';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import Notification from '~/Components/Notification';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';

import {
    Container,
    AdContainer,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
} from './styles';

const Home: React.FC = () => {
    const { reset } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [error, setError] = useState<string>();

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    useEffect(() => {
        if (Platform.OS === 'ios') {
            getAllowedToReadIDFA().then((response) => {
                if (response === null) {
                    reset({
                        routes: [{ name: 'TrackingPermission' }],
                    });
                }
            });
        }
    }, [reset]);

    const adUnit = useMemo(() => {
        if (__DEV__) {
            return TestIds.BANNER;
        }

        if (Platform.OS === 'ios') {
            return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_HOME;
        }

        return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_HOME;
    }, []);

    const bannerSize = useMemo(() => {
        if (PixelRatio.get() < 2) {
            return BannerAdSize.BANNER;
        }

        return BannerAdSize.LARGE_BANNER;
    }, []);

    const getProduts = useCallback(async () => {
        try {
            setIsLoading(true);
            const allProducts = await getAllProducts({
                limit: 20,
                removeProductsWithoutBatches: true,
                removeTreatedBatch: true,
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
                <Container>
                    <Header />

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

                    {!userPreferences.isUserPremium && (
                        <AdContainer>
                            <BannerAd unitId={adUnit} size={bannerSize} />
                        </AdContainer>
                    )}

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
