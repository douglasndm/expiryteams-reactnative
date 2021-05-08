import React, { useContext, useMemo } from 'react';
import { addDays, isPast, parseISO } from 'date-fns';

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

    const exp_date = useMemo(() => {
        if (product.batches[0]) {
            return parseISO(product.batches[0].exp_date);
        }

        return null;
    }, [product.batches]);

    const expired = useMemo(() => {
        if (exp_date && isPast(exp_date)) {
            return true;
        }
        return false;
    }, [exp_date]);

    const nextToExp = useMemo(() => {
        if (
            exp_date &&
            addDays(new Date(), userPreferences.howManyDaysToBeNextToExpire) >=
                exp_date
        )
            return true;

        return false;
    }, [userPreferences.howManyDaysToBeNextToExpire, exp_date]);

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
