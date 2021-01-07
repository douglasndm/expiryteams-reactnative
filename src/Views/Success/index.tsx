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

        switch (type) {
            case 'create_batch':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDABATCH;

            case 'create_product':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT;

            case 'edit_batch':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTEREDITABATCH;

            case 'edit_product':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTEREDITAPRODUCT;

            case 'delete_batch':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEABATCH;

            case 'delete_product':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEAPRODUCT;

            default: {
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT;
            }
        }
    }, [type]);

    const handleNavigateToHome = useCallback(() => {
        reset({
            routes: [{ name: 'Home' }],
        });
    }, [reset]);

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

                <Button
                    text={translate('View_Success_Button_GoToHome')}
                    onPress={handleNavigateToHome}
                />

                {!userPreferences.isUserPremium && (
                    <BannerAd size={BannerAdSize.BANNER} unitId={adUnitId} />
                )}
            </SuccessMessageContainer>
        </Container>
    );
};

export default Success;
