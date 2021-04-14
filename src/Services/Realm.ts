import Realm from 'realm';

import ProductSchema from '~/Schemas/ProductSchema';
import LoteSchema from '~/Schemas/LoteSchema';
import CategorySchema from '~/Schemas/Category';
import StoreSchema from '~/Schemas/Store';

export default async function RealmInstance(): Promise<Realm> {
    const realm = await Realm.open({
        schema: [ProductSchema, LoteSchema, CategorySchema, StoreSchema],
        schemaVersion: 6,
    });

    return realm;
}
