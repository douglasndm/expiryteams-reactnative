import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Analytics from '@react-native-firebase/analytics';

import { translate } from '../Locales';

import { getProductImagePath } from './Products/Image';

interface shareFileProps {
    fileAsString: string;
    fileName: string;
    fileExtesion: string;
    encoding?: string;
}

export async function shareFile({
    fileAsString,
    fileName,
    fileExtesion,
    encoding = 'utf8',
}: shareFileProps): Promise<void> {
    try {
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}.${fileExtesion}`;

        // VERIFICA SE O ARQUIVO EXISTE E CASO EXISTA APAGUE ELE
        // POR ALGUM MOTIVO A LIB FAZ APPEND AUTOMATICO
        if (await RNFS.exists(path)) {
            await RNFS.unlink(path);
        }

        await RNFS.writeFile(path, fileAsString, encoding);

        await Share.open({
            title: translate('Function_Share_SaveFileTitle'),
            url: `file://${path}`,
        });
    } catch (err) {
        throw new Error(err);
    }
}

interface ShareProductImageWithTextProps {
    productId: number;
    title: string;
    text: string;
}

export async function ShareProductImageWithText({
    productId,
    title,
    text,
}: ShareProductImageWithTextProps): Promise<void> {
    try {
        const imagePath = await getProductImagePath(productId);

        let shareOptions = {
            title,
            message: text,
            url: '',
        };

        if (imagePath !== null) {
            if (await RNFS.exists(imagePath)) {
                shareOptions = {
                    ...shareOptions,
                    url: `file://${imagePath}`,
                };
            }
        }

        Share.open(shareOptions).then(async () => {
            if (!__DEV__) {
                await Analytics().logEvent('user_shared_a_product');
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}
