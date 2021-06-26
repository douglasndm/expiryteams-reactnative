import { startOfDay, parseISO, compareAsc } from 'date-fns';

import API from '~/Services/API';

import { removeCheckedBatches, sortBatches } from './Batches';

interface removeProductsWithCheckedBatchesProps {
    products: Array<IProduct>;
}

export function removeProductsWithCheckedBatches({
    products,
}: removeProductsWithCheckedBatchesProps): Array<IProduct> {
    const prodsWithoutBatches = products.filter(p => {
        const batches = removeCheckedBatches(p.batches);

        if (batches.length > 0) {
            return true;
        }
        return false;
    });

    return prodsWithoutBatches;
}

interface getAllProductsProps {
    team_id: string;
}

export async function getAllProducts({
    team_id,
}: getAllProductsProps): Promise<Array<IProduct>> {
    const response = await API.get<IAllTeamProducts>(
        `/team/${team_id}/products?removeCheckedBatches=true&sortByBatches=true`
    );

    if (response) {
        return response.data.products;
    }

    return [];
}

interface sortProductsByBatchesExpDateProps {
    products: Array<IProduct>;
}

export function sortProductsByBatchesExpDate({
    products,
}: sortProductsByBatchesExpDateProps): Array<IProduct> {
    const prodsWithSortedBatchs = products.sort((prod1, prod2) => {
        const batches1 = sortBatches(prod1.batches);
        const batches2 = sortBatches(prod2.batches);

        // if one of the products doesnt have batches it will return
        // the another one as biggest
        if (batches1.length > 0 && batches2.length <= 0) {
            return -1;
        }
        if (batches1.length === 0 && batches2.length === 0) {
            return 0;
        }
        if (batches1.length <= 0 && batches2.length > 0) {
            return 1;
        }

        const batch1ExpDate = startOfDay(parseISO(batches1[0].exp_date));
        const batch2ExpDate = startOfDay(parseISO(batches2[0].exp_date));

        if (
            batches1[0].status === 'unchecked' &&
            batches2[0].status === 'checked'
        ) {
            return -1;
        }
        if (
            batches1[0].status === 'checked' &&
            batches2[0].status === 'checked'
        ) {
            return compareAsc(batch1ExpDate, batch2ExpDate);
        }
        if (
            batches1[0].status === 'checked' &&
            batches2[0].status === 'unchecked'
        ) {
            return 1;
        }

        return compareAsc(batch1ExpDate, batch2ExpDate);
    });

    return prodsWithSortedBatchs;
}
