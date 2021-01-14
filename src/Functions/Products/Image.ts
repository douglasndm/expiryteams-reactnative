import {
    DocumentDirectoryPath,
    readDir,
    exists,
    unlink,
} from 'react-native-fs';

import { getProductById, updateProduct } from '../Product';

export async function getProductImagePath(
    productId: number
): Promise<string | null> {
    try {
        const product = await getProductById(productId);

        if (product.photo) {
            if (await exists(product.photo)) {
                return product.photo;
            }

            const filesDir = await readDir(`${DocumentDirectoryPath}/images`);
            const findedFile = filesDir.find(
                (file) => file.name === product.photo
            );

            if (findedFile) {
                return findedFile.path;
            }
        }

        return null;
    } catch (err) {
        throw new Error(err.message);
    }
}

interface saveProductIamgeProps {
    fileName: string;
    productId: number;
}

export async function saveProductImage({
    fileName,
    productId,
}: saveProductIamgeProps): Promise<void> {
    try {
        const product = await getProductById(productId);

        let path;

        // For old users at 1.7.1 (app was save all path, not only file name)
        if (await exists(fileName)) {
            path = fileName;
        } else {
            const filesDir = await readDir(`${DocumentDirectoryPath}/images`);

            const findedFile = filesDir.find((file) => file.name === fileName);

            if (!findedFile) {
                throw new Error('File was not find');
            }

            path = findedFile.path;
        }

        if (!path) {
            throw new Error('Image path was not defined');
        }

        if (product.photo) {
            const oldImagePath = await getProductImagePath(productId);

            if (oldImagePath) {
                if (await exists(oldImagePath)) {
                    await unlink(oldImagePath);
                }
            }
        }

        await updateProduct({
            ...product,
            id: productId,
            photo: fileName,
        });
    } catch (err) {
        throw new Error(err.message);
    }
}
