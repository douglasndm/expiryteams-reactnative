import {
    DocumentDirectoryPath,
    readDir,
    exists,
    unlink,
    mkdir,
    copyFile,
} from 'react-native-fs';

export function getImageFileNameFromPath(path: string): string {
    const productImage = path.split('/');

    const fileName = productImage[productImage?.length - 1];

    return fileName;
}

export async function getProductImagePath(
    productId: number
): Promise<string | null> {
    try {
        const product = await getProductById(productId);

        if (product.photo) {
            if (await exists(product.photo)) {
                return product.photo;
            }

            const imagesPath = `${DocumentDirectoryPath}/images`;

            if (!(await exists(imagesPath))) {
                await mkdir(imagesPath);
            }

            const filesDir = await readDir(imagesPath);
            const findedFile = filesDir.find(file => {
                const productImage = product.photo?.split('/');

                if (productImage) {
                    const fileName = productImage[productImage?.length - 1];

                    if (file.name === fileName) return true;
                    return false;
                }

                return false;
            });

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

            const findedFile = filesDir.find(file => file.name === fileName);

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

interface copyTempImageResponse {
    fileName: string;
    filePath: string;
}

export async function copyImageFromTempDirToDefinitiveDir(
    tempPath: string
): Promise<copyTempImageResponse> {
    const splited = tempPath.split('/');
    const generatedFilneName = splited[splited.length - 1];

    const fileName = `${Date.now()}-${generatedFilneName}`;

    const existsFolder = await exists(`${DocumentDirectoryPath}/images`);
    if (!existsFolder) {
        await mkdir(`${DocumentDirectoryPath}/images`);
    }

    const newPath = `${DocumentDirectoryPath}/images/${fileName}`;

    await copyFile(tempPath, newPath);
    await unlink(tempPath);

    return {
        fileName,
        filePath: newPath,
    };
}
