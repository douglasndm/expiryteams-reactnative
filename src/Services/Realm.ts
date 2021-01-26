import Realm from 'realm';

import ProductSchema from '~/Schemas/ProductSchema';
import LoteSchema from '~/Schemas/LoteSchema';
import CategorySchema from '~/Schemas/Category';

export default async function RealmInstance(): Promise<Realm> {
    const realm = await Realm.open({
        schema: [ProductSchema, LoteSchema, CategorySchema],
        schemaVersion: 5,
    });

    return realm;
}
