import React, { useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { format, formatDistanceToNow, parseISO } from 'date-fns'; // eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line

import strings from '~/Locales';

import {
    Card,
    Content,
    ProductDetails,
    TextContainer,
    ProductName,
    ProductInfoItem,
    ProductExpDate,
} from './styles';

interface Request {
    product: IProduct;

    expired: boolean;
    nextToExp: boolean;
    onLongPress: () => void;
}
const Product = ({ product, expired, nextToExp, onLongPress }: Request) => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const languageCode = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return enUS;
        }
        return ptBR;
    }, []);
    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);

    const expiredOrNext = useMemo(() => {
        return !!(expired || nextToExp);
    }, [expired, nextToExp]);

    const batch = useMemo(() => {
        const sortedBatches = product.batches.sort((batch1, batch2) => {
            if (batch1.exp_date > batch2.exp_date) return 1;
            if (batch1.exp_date < batch2.exp_date) return -1;
            return 0;
        });

        if (sortedBatches[0]) {
            return sortedBatches[0];
        }

        return null;
    }, [product.batches]);

    const exp_date = useMemo(() => {
        if (batch) {
            return parseISO(batch.exp_date);
        }
        return null;
    }, [batch]);

    const handleNavigateToProduct = useCallback(() => {
        navigate('ProductDetails', { id: product.id });
    }, [navigate, product.id]);

    return (
        <Card
            expired={expired}
            nextToExp={nextToExp}
            threated={batch?.status === 'checked'}
            onPress={handleNavigateToProduct}
            onLongPress={onLongPress}
        >
            <Content>
                <TextContainer>
                    <ProductName expiredOrNext={expiredOrNext}>
                        {product.name}
                    </ProductName>
                    <ProductDetails>
                        {!!product.code && (
                            <ProductInfoItem expiredOrNext={expiredOrNext}>
                                {`${strings.ProductCardComponent_ProductCode}: ${product.code}`}
                            </ProductInfoItem>
                        )}

                        {!!batch && !!batch.name && (
                            <ProductInfoItem expiredOrNext={expiredOrNext}>
                                {strings.ProductCardComponent_ProductBatch}:{' '}
                                {batch.name}
                            </ProductInfoItem>
                        )}

                        {product.batches.length > 1 && (
                            <ProductInfoItem expiredOrNext={expiredOrNext}>
                                {`${product.batches.length - 1} ${
                                    strings.ProductCardComponent_OthersBatches
                                }`}
                            </ProductInfoItem>
                        )}

                        {product.batches.length > 0 &&
                            !!product.batches[0].amount && (
                                <ProductInfoItem expiredOrNext={expiredOrNext}>
                                    {`${strings.ProductCardComponent_ProductAmount}: ${product.batches[0].amount}`}
                                </ProductInfoItem>
                            )}
                    </ProductDetails>
                </TextContainer>
            </Content>

            {!!exp_date && (
                <ProductExpDate expiredOrNext={expiredOrNext}>
                    {expired
                        ? strings.ProductCardComponent_ProductExpiredIn
                        : strings.ProductCardComponent_ProductExpireIn}
                    {` ${formatDistanceToNow(exp_date, {
                        addSuffix: true,
                        locale: languageCode,
                    })}`}
                    {format(exp_date, `, EEEE, ${dateFormat}`, {
                        locale: languageCode,
                    })}
                </ProductExpDate>
            )}
        </Card>
    );
};

export default React.memo(Product);
