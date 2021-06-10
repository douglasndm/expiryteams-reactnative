import { compareAsc, startOfDay, parseISO } from 'date-fns';

export function sortBatches(batches: Array<IBatch>): Array<IBatch> {
    const sorted = batches.sort((batch1, batch2) => {
        const date1 = startOfDay(parseISO(batch1.exp_date));
        const date2 = startOfDay(parseISO(batch2.exp_date));

        if (compareAsc(date1, date1) > 0) {
            return 1;
        }
        if (compareAsc(date1, date2) === 0) {
            return 0;
        }
        return -1;
    });

    return sorted;
}

export function removeCheckedBatches(batches: Array<IBatch>): Array<IBatch> {
    const filted = batches.filter(batch => batch.status !== 'checked');

    return filted;
}
