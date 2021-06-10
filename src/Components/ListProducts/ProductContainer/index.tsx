import React, { useContext, useMemo } from 'react';
import { addDays, isPast, parseISO, compareAsc, startOfDay } from 'date-fns';

import ProductCard from '~/Components/ListProducts/ProductCard';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { Container } from './styles';

interface RequestProps {
    product: IProduct;
}

const ProductContainer: React.FC<RequestProps> = ({
    product,
}: RequestProps) => {
    const { preferences } = useContext(PreferencesContext);

    const exp_date = useMemo(() => {
        if (product.batches[0]) {
            return startOfDay(parseISO(product.batches[0].exp_date));
        }

        return null;
    }, [product.batches]);

    const expired = useMemo(() => {
        if (exp_date) {
            if (compareAsc(startOfDay(new Date()), exp_date) > 0) {
                return true;
            }
        }
        return false;
    }, [exp_date]);

    const nextToExp = useMemo(() => {
        if (
            exp_date &&
            addDays(new Date(), preferences.howManyDaysToBeNextToExpire) >=
                exp_date
        )
            return true;

        return false;
    }, [preferences.howManyDaysToBeNextToExpire, exp_date]);

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
