import Realm from 'realm';

import ProductSchema from '../Schemas/ProductSchema';
import LoteSchema from '../Schemas/LoteSchema';

export default async function RealmInstance(): Promise<Realm> {
    const realm = await Realm.open({
        schema: [ProductSchema, LoteSchema],
        schemaVersion: 4,
    });

    return realm;
}
