import React, { useState, useEffect, useContext, useMemo } from 'react';
import { PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { format, formatDistanceToNow } from 'date-fns'; // eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line

import NumberFormat from 'react-number-format';

import { translate } from '../../Locales';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    Card,
    ProductDetails,
    ProductDetailsContainer,
    ProductName,
    ProductCode,
    ProductLote,
    ProductStore,
    ProductExpDate,
    LoteDetailsContainer,
    AmountContainer,
    AmountContainerText,
    Amount,
    PriceContainer,
    PriceContainerText,
    Price,
} from './styles';

interface Request {
    product: IProduct;

    expired: boolean;
    nextToExp: boolean;
}
const Product = ({ product, expired, nextToExp }: Request) => {
    const navigation = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const [totalPrice, setTotalPrice] = useState(0);
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
        if (product.lotes[0]) {
            return product.lotes[0].exp_date;
        }
        return null;
    }, [product.lotes]);

    const expiredOrNext = useMemo(() => {
        return !!(expired || nextToExp);
    }, [expired, nextToExp]);

    useEffect(() => {
        if (product.lotes[0]) {
            if (product.lotes[0].amount && product.lotes[0].price) {
                setTotalPrice(product.lotes[0].price * product.lotes[0].amount);
            }
        }
    }, [product]);

    return (
        <Container>
            <Card
                onPress={() => {
                    navigation.navigate('ProductDetails', { id: product.id });
                }}
                expired={expired}
                nextToExp={nextToExp}
            >
                <ProductDetails>
                    <ProductDetailsContainer>
                        <ProductName expiredOrNext={expiredOrNext}>
                            {product.name}
                        </ProductName>
                        {!!product.code && (
                            <ProductCode expiredOrNext={expiredOrNext}>
                                {translate('ProductCardComponent_ProductCode')}:
                                {product.code}
                            </ProductCode>
                        )}

                        {product.lotes.length > 0 && !!product.lotes[0].lote && (
                            <ProductLote expiredOrNext={expiredOrNext}>
                                {translate('ProductCardComponent_ProductBatch')}
                                : {product.lotes[0].lote}
                            </ProductLote>
                        )}

                        {userPreferences.multiplesStores && !!product.store && (
                            <ProductStore expiredOrNext={expiredOrNext}>
                                {translate('ProductCardComponent_ProductStore')}
                                : {product.store}
                            </ProductStore>
                        )}
                    </ProductDetailsContainer>

                    {product.lotes.length > 0 && !!product.lotes[0].amount && (
                        <LoteDetailsContainer>
                            <AmountContainer>
                                <AmountContainerText
                                    expiredOrNext={expiredOrNext}
                                >
                                    {translate(
                                        'ProductCardComponent_ProductAmount'
                                    )}
                                </AmountContainerText>
                                <Amount expiredOrNext={expiredOrNext}>
                                    {product.lotes[0].amount}
                                </Amount>
                            </AmountContainer>

                            {PixelRatio.get() > 1 && totalPrice > 0 && (
                                <PriceContainer>
                                    <PriceContainerText
                                        expiredOrNext={expiredOrNext}
                                    >
                                        {translate(
                                            'ProductCardComponent_ProductPrice'
                                        )}
                                    </PriceContainerText>
                                    <Price expiredOrNext={expiredOrNext}>
                                        <NumberFormat
                                            value={totalPrice}
                                            displayType="text"
                                            thousandSeparator
                                            prefix="R$"
                                            renderText={(value) => value}
                                            decimalScale={2}
                                        />
                                    </Price>
                                </PriceContainer>
                            )}
                        </LoteDetailsContainer>
                    )}
                </ProductDetails>

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
        </Container>
    );
};

export default React.memo(Product);
