import React, {
    useState,
    useEffect,
    useContext,
    useMemo,
    useCallback,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { format, formatDistanceToNow, parseISO } from 'date-fns'; // eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line


import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getProductImagePath } from '~/Functions/Products/Image';

import {
    Card,
    Content,
    ProductDetails,
    TextContainer,
    ProductName,
    ProductInfoItem,
    ProductExpDate,
    ProductImage,
} from './styles';

interface Request {
    product: IProduct;

    expired: boolean;
    nextToExp: boolean;
}
const Product = ({ product, expired, nextToExp }: Request) => {
    const { navigate } = useNavigation();

    const { preferences } = useContext(PreferencesContext);

    const [imagePath, setImagePath] = useState<string>('');
    const [storeName, setStoreName] = useState<string | null>();

    const [languageCode] = useState(() => {
        if (getLocales()[0].languageCode === 'en') {
            return enUS;
        }
        return ptBR;
    });
    const [dateFormat] = useState(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    });

    const exp_date = useMemo(() => {
        if (product.batches[0]) {
            return parseISO(product.batches[0].exp_date);
        }
        return null;
    }, [product.batches]);

    const expiredOrNext = useMemo(() => {
        return !!(expired || nextToExp);
    }, [expired, nextToExp]);

    const batch = useMemo(() => {
        if (product.batches[0]) {
            return product.batches[0];
        }

        return null;
    }, [product.batches]);

    const handleNavigateToProduct = useCallback(() => {
        navigate('ProductDetails', { id: product.id });
    }, [navigate, product.id]);

    return (
        <Card
            expired={expired}
            nextToExp={nextToExp}
            threated={batch?.status === 'checked'}
            onPress={handleNavigateToProduct}
        >
            <Content>
                {preferences.isUserPremium && !!imagePath && (
                    <ProductImage source={{ uri: imagePath }} />
                )}

                <TextContainer>
                    <ProductName expiredOrNext={expiredOrNext}>
                        {product.name}
                    </ProductName>
                    <ProductDetails>
                        {!!product.code && (
                            <ProductInfoItem expiredOrNext={expiredOrNext}>
                                {`${translate(
                                    'ProductCardComponent_ProductCode'
                                )}: ${product.code}`}
                            </ProductInfoItem>
                        )}

                        {product.batches.length > 0 &&
                            !!product.batches[0].name && (
                                <ProductInfoItem expiredOrNext={expiredOrNext}>
                                    {translate(
                                        'ProductCardComponent_ProductBatch'
                                    )}
                                    : {product.batches[0].name}
                                </ProductInfoItem>
                            )}

                        {product.batches.length > 1 && (
                            <ProductInfoItem expiredOrNext={expiredOrNext}>
                                {`${product.batches.length - 1} ${translate(
                                    'ProductCardComponent_OthersBatches'
                                )}`}
                            </ProductInfoItem>
                        )}

                        {preferences.multiplesStores && !!storeName && (
                            <ProductInfoItem expiredOrNext={expiredOrNext}>
                                {translate('ProductCardComponent_ProductStore')}
                                : {storeName}
                            </ProductInfoItem>
                        )}

                        {product.batches.length > 0 &&
                            !!product.batches[0].amount && (
                                <ProductInfoItem expiredOrNext={expiredOrNext}>
                                    {`${translate(
                                        'ProductCardComponent_ProductAmount'
                                    )}: ${product.batches[0].amount}`}
                                </ProductInfoItem>
                            )}
                    </ProductDetails>
                </TextContainer>
            </Content>

            {!!exp_date && (
                <ProductExpDate expiredOrNext={expiredOrNext}>
                    {expired
                        ? translate('ProductCardComponent_ProductExpiredIn')
                        : translate('ProductCardComponent_ProductExpireIn')}
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
