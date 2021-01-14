import React, { useCallback, useContext } from 'react';
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
    const navigation = useNavigation();
    const { userPreferences } = useContext(PreferencesContext);

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENSTOREGROUPS;

    const resultsTemp = sortProductsLotesByLotesExpDate(products);
    const results = sortProductsByFisrtLoteExpDate(resultsTemp);

    const handleStoreDetails = useCallback(() => {
        navigation.push('StoreDetails', {
            storeName,
        });
    }, [storeName, navigation]);

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
                    <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
                </AdView>
            )}
        </StoreGroupContainer>
    );
};

export default StoreGroup;
