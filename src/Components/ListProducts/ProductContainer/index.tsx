import React, { useContext, useMemo } from 'react';

import { addDays, isPast } from 'date-fns';

import ProductCard from '~/Components/ListProducts/ProductCard';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { Container } from './styles';

interface RequestProps {
    product: IProduct;
}

const ProductContainer: React.FC<RequestProps> = ({
    product,
}: RequestProps) => {
    const { userPreferences } = useContext(PreferencesContext);

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

    return (
        <Container>
            <ProductCard
                product={product}
                expired={expired}
                nextToExp={nextToExp}
            />
        </Container>
    );
};

export default React.memo(ProductContainer);
