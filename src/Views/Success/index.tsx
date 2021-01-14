import React, { useCallback, useContext, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import { translate } from '../../Locales';

import PreferencesContext from '../../Contexts/PreferencesContext';

import StatusBar from '../../Components/StatusBar';
import Button from '../../Components/Button';

import {
    Container,
    SuccessMessageContainer,
    Title,
    Description,
} from './styles';

interface Props {
    type:
        | 'create_batch'
        | 'create_product'
        | 'edit_batch'
        | 'edit_product'
        | 'delete_batch'
        | 'delete_product';
    productId?: number;
}

const Success: React.FC = () => {
    const route = useRoute();
    const { reset } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const routeParams = route.params as Props;

    const type = useMemo(() => {
        return routeParams.type;
    }, [routeParams]);

    const animation = useMemo(() => {
        switch (type) {
            case 'delete_batch':
                return require('../../Assets/Animations/delete-animation.json');
            case 'delete_product':
                return require('../../Assets/Animations/delete-animation.json');
            default:
                return require('../../Assets/Animations/success.json');
        }
    }, [type]);

    const adUnitId = useMemo(() => {
        if (__DEV__) return TestIds.BANNER;

        return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_SUCCESSPAGE;
    }, []);

    const bannerSize = useMemo(() => {
        return BannerAdSize.MEDIUM_RECTANGLE;
    }, []);

    const handleNavigate = useCallback(() => {
        if (routeParams.productId) {
            if (
                type === 'create_batch' ||
                type === 'create_product' ||
                type === 'edit_batch' ||
                type === 'edit_product'
            ) {
                reset({
                    routes: [
                        { name: 'Home' },
                        {
                            name: 'ProductDetails',
                            params: {
                                id: routeParams.productId,
                            },
                        },
                    ],
                });
            }
            return;
        }

        reset({
            routes: [{ name: 'Home' }],
        });
    }, [reset, routeParams.productId, type]);

    return (
        <Container>
            <StatusBar />

            <SuccessMessageContainer>
                <LottieView
                    source={animation}
                    autoPlay
                    loop={false}
                    style={{ width: 180, height: 180 }}
                />

                {type === 'create_batch' && (
                    <Title>{translate('View_Success_BatchCreated')}</Title>
                )}
                {type === 'create_product' && (
                    <Title>{translate('View_Success_ProductCreated')}</Title>
                )}
                {type === 'edit_batch' && (
                    <Title>{translate('View_Success_BatchUpdated')}</Title>
                )}
                {type === 'edit_product' && (
                    <Title>{translate('View_Success_ProductUpdated')}</Title>
                )}
                {type === 'delete_batch' && (
                    <Title>{translate('View_Success_BatchDeleted')}</Title>
                )}
                {type === 'delete_product' && (
                    <Title>{translate('View_Success_ProductDeleted')}</Title>
                )}

                {type === 'create_batch' && (
                    <Description>
                        {translate('View_Success_BatchCreatedDescription')}
                    </Description>
                )}
                {type === 'create_product' && (
                    <Description>
                        {translate('View_Success_ProductCreatedDescription')}
                    </Description>
                )}
                {type === 'edit_batch' && (
                    <Description>
                        {translate('View_Success_BatchUpdatedDescription')}
                    </Description>
                )}
                {type === 'edit_product' && (
                    <Description>
                        {translate('View_Success_ProductUpdatedDescription')}
                    </Description>
                )}
                {type === 'delete_batch' && (
                    <Description>
                        {translate('View_Success_BatchDeletedDescription')}
                    </Description>
                )}
                {type === 'delete_product' && (
                    <Description>
                        {translate('View_Success_ProductDeletedDescription')}
                    </Description>
                )}

                {(type === 'create_batch' ||
                    type === 'create_product' ||
                    type === 'edit_batch' ||
                    type === 'edit_product') &&
                !!routeParams.productId ? (
                    <Button
                        text={translate(
                            'View_Success_Button_NavigateToProduct'
                        )}
                        onPress={handleNavigate}
                    />
                ) : (
                    <Button
                        text={translate('View_Success_Button_GoToHome')}
                        onPress={handleNavigate}
                    />
                )}

                {!userPreferences.isUserPremium && (
                    <BannerAd size={bannerSize} unitId={adUnitId} />
                )}
            </SuccessMessageContainer>
        </Container>
    );
};

export default Success;
