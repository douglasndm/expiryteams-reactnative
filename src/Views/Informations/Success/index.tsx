import React, { useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import strings from '~/Locales';

import StatusBar from '~/Components/StatusBar';
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

    const handleNavigateToCategory = useCallback(() => {
        reset({
            routes: [
                {
                    name: 'Home',
                },
                {
                    name: 'CategoryView',
                    params: {
                        category_id,
                    },
                },
            ],
        });
    }, [category_id, reset]);

    const animation = useMemo(() => {
        switch (type) {
            case 'delete_batch':
                return require('~/Assets/Animations/delete-animation.json');
            case 'delete_product':
                return require('~/Assets/Animations/delete-animation.json');
            default:
                return require('~/Assets/Animations/success.json');
        }
    }, [type]);

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
                    <Title>{strings.View_Success_BatchCreated}</Title>
                )}
                {type === 'create_product' && (
                    <Title>{strings.View_Success_ProductCreated}</Title>
                )}
                {type === 'edit_batch' && (
                    <Title>{strings.View_Success_BatchUpdated}</Title>
                )}
                {type === 'edit_product' && (
                    <Title>{strings.View_Success_ProductUpdated}</Title>
                )}
                {type === 'delete_batch' && (
                    <Title>{strings.View_Success_BatchDeleted}</Title>
                )}
                {type === 'delete_product' && (
                    <Title>{strings.View_Success_ProductDeleted}</Title>
                )}

                {type === 'create_batch' && (
                    <Description>
                        {strings.View_Success_BatchCreatedDescription}
                    </Description>
                )}
                {type === 'create_product' && (
                    <Description>
                        {strings.View_Success_ProductCreatedDescription}
                    </Description>
                )}
                {type === 'edit_batch' && (
                    <Description>
                        {strings.View_Success_BatchUpdatedDescription}
                    </Description>
                )}
                {type === 'edit_product' && (
                    <Description>
                        {strings.View_Success_ProductUpdatedDescription}
                    </Description>
                )}
                {type === 'delete_batch' && (
                    <Description>
                        {strings.View_Success_BatchDeletedDescription}
                    </Description>
                )}
                {type === 'delete_product' && (
                    <Description>
                        {strings.View_Success_ProductDeletedDescription}
                    </Description>
                )}

                <ButtonContainer>
                    {category_id && (
                        <Button onPress={handleNavigateToCategory}>
                            <ButtonText>
                                {strings.View_Success_Button_GoToCategory}
                            </ButtonText>
                        </Button>
                    )}

                    <Button onPress={handleNavigateHome}>
                        <ButtonText>
                            {strings.View_Success_Button_GoToHome}
                        </ButtonText>
                    </Button>

                    {(type === 'create_batch' ||
                        type === 'create_product' ||
                        type === 'edit_batch' ||
                        type === 'edit_product') &&
                        !!routeParams.productId && (
                            <Button onPress={handleNavigateToProduct}>
                                <ButtonText>
                                    {
                                        strings.View_Success_Button_NavigateToProduct
                                    }
                                </ButtonText>
                            </Button>
                        )}
                </ButtonContainer>
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
