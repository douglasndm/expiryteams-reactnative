import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';
import { addDays, isPast } from 'date-fns';

import { translate } from '~/Locales';

import ProductCard from '~/Components/ListProducts/ProductCard';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { Container, AdView, ButtonPro, ButtonProText } from './styles';

interface RequestProps {
    product: IProduct;
    index?: number;
    disableAds?: boolean;
}

const ProductContainer: React.FC<RequestProps> = ({
    product,
    index,
    disableAds,
}: RequestProps) => {
    const { userPreferences } = useContext(PreferencesContext);
    const { navigate } = useNavigation();

    const [adFailed, setAdFailed] = useState(false);

    const expired = useMemo(() => {
        return product.lotes[0] && isPast(product.lotes[0].exp_date);
    }, [product.lotes]);

    const nextToExp = useMemo(() => {
        return (
            product.lotes[0] &&
            addDays(new Date(), userPreferences.howManyDaysToBeNextToExpire) >=
                product.lotes[0].exp_date
        );
    }, [userPreferences.howManyDaysToBeNextToExpire, product.lotes]);

    const adUnitId = useMemo(() => {
        if (__DEV__) {
            return TestIds.BANNER;
        }

        return Platform.OS === 'ios'
            ? EnvConfig.IOS_ADUNIT_BANNER_BETWEEN_PRODUCTS_LIST
            : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENPRODUCTS;
    }, []);

    const bannerSize = useMemo(() => {
        if (PixelRatio.get() >= 3) {
            return BannerAdSize.ADAPTIVE_BANNER;
        }

        return BannerAdSize.LARGE_BANNER;
    }, []);

    const showAd = useMemo(() => {
        if (disableAds) return false;
        if (userPreferences.isUserPremium) return false;
        if (adFailed) return false;
        if (index === 0) return false;
        if (index && index % 5 === 0) return true;
        return false;
    }, [disableAds, userPreferences.isUserPremium, index, adFailed]);

    const handleNavigateToProPage = useCallback(() => {
        navigate('PremiumSubscription');
    }, [navigate]);

    const choosenAdText = useMemo(() => {
        return Math.floor(Math.random() * 3) + 1;
    }, []);

    return (
        <Container>
            {showAd && (
                <AdView>
                    <BannerAd
                        unitId={adUnitId}
                        size={bannerSize}
                        onAdFailedToLoad={() => setAdFailed(true)}
                    />

                    <ButtonPro onPress={handleNavigateToProPage}>
                        <ButtonProText>
                            {translate(`ProBanner_Text${choosenAdText}`)}
                        </ButtonProText>
                    </ButtonPro>
                </AdView>
            )}

            <ProductCard
                product={product}
                expired={expired}
                nextToExp={nextToExp}
            />
        </Container>
    );
};

export default React.memo(ProductContainer);
