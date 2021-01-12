import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import CryptoJS from 'crypto-js';
import EnvConfig from 'react-native-config';

import { translate } from '../Locales';

import { createProduct } from './Product';
import { GetAllProducts } from './Products';
import { shareFile } from './Share';

export async function ExportBackupFile(): Promise<void> {
    try {
        const allProducts = await GetAllProducts();

        // O REALM GRAVA TUDO EM OBJETOS E NÃO EM ARRAYS
        // ISSO CONVERTE TUDO EM ARRAYS
        // APENAS PARA ORGANIZAÇÃO FUTURA
        const arrayProducts: Array<IProduct> = [];

        allProducts.forEach((p) => {
            const arrayLotes: Array<ILote> = [];

            if (p.lotes.length > 0) {
                p.lotes.forEach((lote) => arrayLotes.push(lote));
            }

            const newProduct = {
                id: p.id,
                name: p.name,
                code: p.code,
                store: p.store,
                lotes: arrayLotes,
            };

            arrayProducts.push(newProduct);
        });

        const encryptedProducts = CryptoJS.AES.encrypt(
            JSON.stringify(arrayProducts),
            EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT
        ).toString();

        await shareFile({
            fileAsString: encryptedProducts,
            fileExtesion: 'cvbf',
            fileName: translate('Function_Export_FileName'),
        });
    } catch (err) {
        throw new Error(err);
    }
}

export async function ImportBackupFile(): Promise<void> {
    try {
        const options = {
            type: Platform.OS === 'ios' ? 'public.item' : '*/*',
        };

        const filePicked = await DocumentPicker.pick(options);

        // Separa o nome do arquivo da extensão para fazer a validação da extensão do arquivo
        const [, extension] = filePicked.name.split('.');

        // caso a extensão do arquivo não for cvbf lança um erro e sai da função
        if (extension !== 'cvbf') {
            throw new Error(translate('Function_Import_Error_InvalidExtesion'));
        }

        // pega o arquivo temporario gerado pelo filePicker e faz a leitura dele
        const fileRead = await RNFS.readFile(filePicked.fileCopyUri);

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
    } catch (err) {
        throw new Error(err);
    }
}
