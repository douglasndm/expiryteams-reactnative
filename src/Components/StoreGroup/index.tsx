import React, { useCallback, useContext, useMemo } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EnvConfig from 'react-native-config';

import { translate } from '../../Locales';

import ProductItem from '~/Components/ListProducts/ProductContainer';

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

    const handleStoreDetails = useCallback(() => {
        navigate('StoreDetails', {
            storeName,
        });
    }, [storeName, navigate]);

    return (
        <StoreGroupContainer>
            <StoreTitle onPress={handleStoreDetails}>{storeName}</StoreTitle>

            {results.map(product => (
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
        </StoreGroupContainer>
    );
};

export default StoreGroup;
