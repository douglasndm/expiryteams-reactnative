import {
    getAllProductsByStore,
    getAllProductsWithoutStore,
    getAllStores,
} from './Store';

import { translate } from '../Locales';

interface RequestProps {
    limit?: number;
}

export async function GetAllProductsOrderedByStore({
    limit,
}: RequestProps): Promise<Array<IStoreGroup>> {
    const storeGroup: Array<IStoreGroup> = [];

    const stores = await getAllStores();

    stores.forEach(async (store) => {
        const products = await getAllProductsByStore({ store, limit });

        storeGroup.push({
            name: store,
            products,
        });
    });

    const productsWithoutStore = await getAllProductsWithoutStore();

    storeGroup.push({
        name: translate('Function_StoreGroup_NoStore'),
        products: limit
            ? productsWithoutStore.slice(0, limit)
            : productsWithoutStore,
    });

    return storeGroup;
}
