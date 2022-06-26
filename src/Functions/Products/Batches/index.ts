import { endOfDay, parseISO, compareAsc } from 'date-fns';

export function sortBatches(batches: Array<IBatch>): Array<IBatch> {
    if (batches.length > 1) {
        const sortedBatches = batches.sort((batch1, batch2) => {
            const date1 = parseISO(String(batch1.exp_date));
            const date2 = parseISO(String(batch2.exp_date));

            if (compareAsc(endOfDay(date1), endOfDay(date2)) > 0) return 1;
            if (compareAsc(endOfDay(date1), endOfDay(date2)) < 0) return -1;
            return 0;
        });

        return sortedBatches;
    }
    return batches;
}

export function removeCheckedBatches(batches: Array<IBatch>): Array<IBatch> {
    const filted = batches.filter(batch => batch.status !== 'checked');

    return filted;
}
