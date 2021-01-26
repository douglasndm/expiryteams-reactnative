import React, { useCallback, useContext, useMemo } from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { useNavigation } from '@react-navigation/native';
import EnvConfig from 'react-native-config';

import { translate } from '../../Locales';

import ProductItem from '~/Components/ListProducts/ProductContainer';

import {
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
} from '../../Functions/Products';

import PreferencesContext from '../../Contexts/PreferencesContext';

import Button from '../Button';

import { StoreGroupContainer, StoreTitle, AdView } from './styles';

interface IRequest {
    storeName: string;
    products: Array<IProduct>;
}

const StoreGroup: React.FC<IRequest> = ({ storeName, products }: IRequest) => {
    const { navigate } = useNavigation();
    const { userPreferences } = useContext(PreferencesContext);

    const unitId = useMemo(() => {
        if (__DEV__) {
            return TestIds.BANNER;
        }

        if (Platform.OS === 'ios') {
            return EnvConfig.IOS_ADUNIT_BANNER_BETWEEN_STORE_GROUPS;
        }
        return EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENSTOREGROUPS;
    }, []);

    const resultsTemp = sortProductsLotesByLotesExpDate(products);
    const results = sortProductsByFisrtLoteExpDate(resultsTemp);

    const handleStoreDetails = useCallback(() => {
        navigate('StoreDetails', {
            storeName,
        });
    }, [storeName, navigate]);

    return (
        <StoreGroupContainer>
            <StoreTitle onPress={handleStoreDetails}>{storeName}</StoreTitle>

            {results.map((product) => (
                <ProductItem key={product.id} product={product} disableAds />
            ))}

            {products.length >= 5 && (
                <Button
                    text={translate(
                        'StoreGroupComponent_Button_ShowAllProductFromStore'
                    )}
                    onPress={handleStoreDetails}
                />
            )}

            {!userPreferences.isUserPremium && (
                <AdView>
                    <BannerAd
                        unitId={unitId}
                        size={BannerAdSize.LARGE_BANNER}
                    />
                </AdView>
            )}
        </StoreGroupContainer>
    );
};

export default StoreGroup;
