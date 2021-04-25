import React, { useCallback, useContext, useMemo } from 'react';
import { Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import { translate } from '../../Locales';

import PreferencesContext from '../../Contexts/PreferencesContext';

import StatusBar from '../../Components/StatusBar';
import FloatButton from '~/Components/FloatButton';

import {
    Container,
    SuccessMessageContainer,
    Title,
    Description,
    ButtonContainer,
    Button,
    ButtonText,
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

    category_id?: string;
    store_id?: string;
}

const Success: React.FC = () => {
    const route = useRoute();
    const { reset } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const routeParams = route.params as Props;

    const type = useMemo(() => {
        return routeParams.type;
    }, [routeParams]);

    const productId = useMemo(() => {
        if (routeParams.productId) {
            return routeParams.productId;
        }
        return undefined;
    }, [routeParams.productId]);

    const category_id = useMemo(() => {
        if (!routeParams.category_id || routeParams.category_id === 'null') {
            return null;
        }
        return routeParams.category_id;
    }, [routeParams.category_id]);

    const store_id = useMemo(() => {
        if (!routeParams.store_id || routeParams.store_id === 'null') {
            return null;
        }
        return routeParams.store_id;
    }, [routeParams.store_id]);

    const handleNavigateToCategory = useCallback(() => {
        reset({
            routes: [
                {
                    name: 'Home',
                },
                {
                    name: 'CategoryView',
                    params: {
                        id: category_id,
                    },
                },
            ],
        });
    }, [category_id, reset]);

    const handleNavigateToStore = useCallback(() => {
        reset({
            routes: [
                {
                    name: 'Home',
                },
                {
                    name: 'StoreDetails',
                    params: {
                        store: store_id,
                    },
                },
            ],
        });
    }, [store_id, reset]);

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

        if (Platform.OS === 'ios') {
            return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_SUCCESSPAGE;
        }

        return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_SUCCESSPAGE;
    }, []);

    const bannerSize = useMemo(() => {
        return BannerAdSize.MEDIUM_RECTANGLE;
    }, []);

    const handleNavigateHome = useCallback(() => {
        reset({
            routes: [{ name: 'Home' }],
        });
    }, [reset]);

    const handleNavigateToProduct = useCallback(() => {
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
        }
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

                <ButtonContainer>
                    {userPreferences.isUserPremium && category_id && (
                        <Button onPress={handleNavigateToCategory}>
                            <ButtonText>
                                {translate('View_Success_Button_GoToCategory')}
                            </ButtonText>
                        </Button>
                    )}

                    {userPreferences.isUserPremium && store_id && (
                        <Button onPress={handleNavigateToStore}>
                            <ButtonText>
                                {translate('View_Success_Button_GoToStore')}
                            </ButtonText>
                        </Button>
                    )}

                    <Button onPress={handleNavigateHome}>
                        <ButtonText>
                            {translate('View_Success_Button_GoToHome')}
                        </ButtonText>
                    </Button>

                    {(type === 'create_batch' ||
                        type === 'create_product' ||
                        type === 'edit_batch' ||
                        type === 'edit_product') &&
                        !!routeParams.productId && (
                            <Button onPress={handleNavigateToProduct}>
                                <ButtonText>
                                    {translate(
                                        'View_Success_Button_NavigateToProduct'
                                    )}
                                </ButtonText>
                            </Button>
                        )}
                </ButtonContainer>

                {!userPreferences.isUserPremium && (
                    <BannerAd size={bannerSize} unitId={adUnitId} />
                )}
            </SuccessMessageContainer>

            {type === 'create_product' && (
                <FloatButton navigateTo="AddProduct" />
            )}
            {type === 'create_batch' && productId && (
                <FloatButton navigateTo="AddBatch" productId={productId} />
            )}
        </Container>
    );
};

export default Success;
