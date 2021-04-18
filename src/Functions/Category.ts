import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import { translate } from '~/Locales';

import Realm from '~/Services/Realm';

export async function getCategory(id: string): Promise<ICategory> {
    try {
        const realm = await Realm();

        const realmResponse = realm
            .objects<ICategory>('Category')
            .filtered(`id = "${id}"`)[0];

        return realmResponse;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAllCategories(): Promise<Array<ICategory>> {
    try {
        const realm = await Realm();

        const realmResponse = realm.objects<ICategory>('Category').slice();

        return realmResponse;
    } catch (err) {
        throw new Error(err.message);
    }
}

// this return the category uuid
export async function createCategory(categoryName: string): Promise<ICategory> {
    try {
        const categories = await getAllCategories();

        const categoryAlreadyExists = categories.find(
            (category) =>
                category.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (categoryAlreadyExists) {
            throw new Error(
                translate('Function_Category_AddCategory_Error_AlreadyExists')
            );
        }

        const realm = await Realm();

        const categoryUuid = await UUID.getRandomUUID();

        const category: ICategory = {
            id: categoryUuid,
            name: categoryName,
        };

        realm.write(() => {
            realm.create<ICategory>('Category', category, UpdateMode.Never);
        });

        return category;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateCategory(category: ICategory): Promise<void> {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create('Category', category, UpdateMode.Modified);
        });
    } catch (err) {
        throw new Error(err);
    }
}

export async function getAllProductsByCategory(
    categoryUuid: string
): Promise<Array<IProduct>> {
    try {
        const realm = await Realm();

        const products = realm.objects<IProduct>('Product').slice();

        const filtedProducts = products.filter((p) => {
            const isInCategory = p.categories.find((c) => c === categoryUuid);

            if (isInCategory) return true;
            return false;
        });

        return filtedProducts;
    } catch (err) {
        throw new Error(err.message);
    }
}
