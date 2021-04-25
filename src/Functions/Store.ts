import Realm from '../Services/Realm';

export async function getAllStores(): Promise<Array<string>> {
    const realm = await Realm();

    try {
        const stores: Array<string> = [];

        const results = realm.objects<IProduct>('Product').sorted('store');

        results.forEach(product => {
            if (product.store) {
                const temp = stores.find(store => store === product.store);

                if (!temp) {
                    stores.push(product.store);
                }
            }
        });

        return stores;
    } catch (err) {
        throw new Error(err);
    }
}
