import { Platform } from 'react-native';
import RNFS, {
    copyFile,
    DocumentDirectoryPath,
    exists,
    mkdir,
    readDir,
    unlink,
} from 'react-native-fs';
import { unzip, zip } from 'react-native-zip-archive';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';
import CryptoJS from 'crypto-js';
import EnvConfig from 'react-native-config';
import RNGRP from 'react-native-get-real-path';

import { translate } from '../Locales';

import { createProduct } from './Product';
import { getAllProducts } from './Products';

const backupDir = `${DocumentDirectoryPath}/backupDir`;

async function genereteZipImagesFolder(): Promise<string> {
    try {
        const allProducts = await getAllProducts({});

        const productsWithPics = allProducts.filter((p) => p.photo);
        const dir = await readDir(DocumentDirectoryPath);

        const files: Array<IProductImage> = [];

        productsWithPics.forEach((p) => {
            const findedPic = dir.find(
                (file) => file.name === p.photo || file.path === p.photo
            );

            if (findedPic) {
                files.push({
                    productId: p.id,
                    imageName: findedPic.name,
                    imagePath: findedPic.path,
                });
            }
        });

        const targetPath = `${backupDir}/backupImages.zip`;
        const sourcePath = `${DocumentDirectoryPath}/images`;

        if (await exists(targetPath)) {
            await unlink(targetPath);
        }

        const zipPath = await zip(sourcePath, targetPath);

        return zipPath;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function exportBackupFile(): Promise<void> {
    try {
        if (!(await exists(`${backupDir}`))) {
            await mkdir(`${backupDir}`);
        }

        const allProducts = await getAllProducts({});

        const encryptedProducts = CryptoJS.AES.encrypt(
            JSON.stringify(allProducts),
            EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT
        ).toString();

        await genereteZipImagesFolder();

        const productsFilePath = `${backupDir}/${translate(
            'Function_Export_FileName'
        )}.cvbf`;

        // VERIFICA SE O ARQUIVO EXISTE E CASO EXISTA APAGUE ELE
        // POR ALGUM MOTIVO A LIB FAZ APPEND AUTOMATICO
        if (await RNFS.exists(productsFilePath)) {
            await RNFS.unlink(productsFilePath);
        }

        await RNFS.writeFile(productsFilePath, encryptedProducts, 'utf8');

        const zipPath = await zip(
            `${backupDir}`,
            `${DocumentDirectoryPath}/${translate(
                'Function_Export_FileName'
            )}.zip`
        );

        await Share.open({
            title: translate('Function_Share_SaveFileTitle'),
            message: translate('Function_Share_SaveFileDescription'),
            url: `file://${zipPath}`,
        });

        await unlink(`${backupDir}`);
    } catch (err) {
        if (err.message !== 'Error: User did not share') {
            throw new Error(err.message);
        }
    }
}

export async function importBackupFile(): Promise<void> {
    try {
        const options = {
            type: Platform.OS === 'ios' ? 'public.item' : '*/*',
            copyTo: 'documentDirectory',
        };

        const filePicked = await DocumentPicker.pick(options);

        // Separa o nome do arquivo da extensão para fazer a validação da extensão do arquivo
        const [, extension] = filePicked.name.split('.');

        // caso a extensão do arquivo não for cvbf lança um erro e sai da função
        if (extension !== 'cvbf' && extension !== 'zip') {
            throw new Error(translate('Function_Import_Error_InvalidExtesion'));
        }

        let backupFilePath = null;

        if (extension === 'zip') {
            if (!(await exists(backupDir))) {
                await mkdir(backupDir);
            }

            let filePath = null;

            if (Platform.OS === 'android') {
                filePath = await RNGRP.getRealPathFromURI(filePicked.uri);
            } else {
                filePath = filePicked.fileCopyUri;
            }

            await unzip(filePath, backupDir);

            if (await exists(`${backupDir}/backupImages.zip`)) {
                await unzip(
                    `${backupDir}/backupImages.zip`,
                    `${DocumentDirectoryPath}/images`
                );
            }

            const dir = await readDir(backupDir);
            const backupFile = dir.find((item) => {
                const [, ext] = item.name.split('.');

                if (ext === 'cvbf') return true;
                return false;
            });

            if (backupFile?.name) {
                backupFilePath = `${backupDir}/${backupFile.name}`;
            }
        }
        if (extension === 'cvbf') {
            backupFilePath = filePicked.fileCopyUri;
        }

        if (!backupFilePath) {
            throw new Error('Extesion is not valid');
        }

        // pega o arquivo temporario gerado pelo filePicker e faz a leitura dele
        const fileRead = await RNFS.readFile(backupFilePath);

        // decriptografa o arquivo lido
        const decryptedFile = CryptoJS.AES.decrypt(
            fileRead,
            EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT
        );

        // converte o arquivo em formato de bytes puros para string
        const originalFile = decryptedFile.toString(CryptoJS.enc.Utf8);

        // converte tudo de novo para json
        const products = JSON.parse(originalFile);

        for (const p of products) {
            await createProduct({ product: p, ignoreDuplicate: true });
        }

        await unlink(backupDir);
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}
interface IProductImage {
    productId: number;
    imagePath: string;
    imageName: string;
}
