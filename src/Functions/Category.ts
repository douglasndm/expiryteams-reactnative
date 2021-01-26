import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import { translate } from '~/Locales';

import Realm from '~/Services/Realm';

export async function getAllCategories(): Promise<Array<ICategory>> {
    try {
        const realm = await Realm();

        const realmResponse = realm.objects<ICategory>('Category').slice();

        // // I did it because realm return a "complex" object and I just want the name and id
        // const categories: Array<ICategory> = [];

        // realmResponse.forEach((category) =>
        //     categories.push({
        //         id: category.id,
        //         name: category.name,
        //     })
        // );

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
