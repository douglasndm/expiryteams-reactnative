import React, { useContext, useMemo } from 'react';
import { addDays, isPast, parseISO, startOfDay } from 'date-fns';

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
            return startOfDay(parseISO(batch.exp_date));
        }
        return null;
    }, [batch]);

    const expired = useMemo(() => {
        if (exp_date) {
            return isPast(exp_date);
        }
        return false;
    }, [exp_date]);

    const nextToExp = useMemo(() => {
        if (exp_date) {
            if (
                addDays(new Date(), preferences.howManyDaysToBeNextToExpire) >=
                exp_date
            ) {
                return true;
            }
        }

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
