import { startOfDay, parseISO } from 'date-fns';

export function sortBatches(batches: Array<IBatch>): Array<IBatch> {
    const sorted = batches.sort((batch1, batch2) => {
        const date1 = startOfDay(parseISO(batch1.exp_date));
        const date2 = startOfDay(parseISO(batch2.exp_date));

        if (date1 > date2) {
            return 1;
        }
        if (date1 < date2) {
            return -1;
        }

        return 0;
    });

    return sorted;
}

export function removeCheckedBatches(batches: Array<IBatch>): Array<IBatch> {
    const filted = batches.filter(batch => batch.status !== 'checked');

    return filted;
}
