import React, { useCallback } from 'react';
import { ScrollView, Alert } from 'react-native';
import { DocumentDirectoryPath, readDir, mkdir, exists } from 'react-native-fs';
import { encryptionMethods, zip } from 'react-native-zip-archive';
import { addDays, mk } from 'date-fns';

import Realm from '../../Services/Realm';

import Button from '../../Components/Button';

import { getEnableNotifications } from '../../Functions/Settings';
import { Container, Category } from '../Settings/styles';
import { getAllProducts } from '~/Functions/Products';

const Test: React.FC = () => {
    async function sampleData() {
        const realm = await Realm();

        try {
            realm.write(() => {
                for (let i = 0; i < 50; i++) {
                    const lastProduct = realm
                        .objects<IProduct>('Product')
                        .sorted('id', true)[0];
                    const nextProductId =
                        lastProduct == null ? 1 : lastProduct.id + 1;

                    const lastLote = realm
                        .objects<ILote>('Lote')
                        .sorted('id', true)[0];
                    const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

                    realm.create('Product', {
                        id: nextProductId,
                        name: `Product ${i}`,
                        code: `${i}7841686${i}`,
                        lotes: [
                            {
                                id: nextLoteId,
                                lote: `ABC${i}xyz`,
                                exp_date: addDays(new Date(), 1 * i),
                                amount: i,
                                status: 'Não tratado',
                            },
                        ],
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteProducts() {
        const realm = await Realm();
        try {
            realm.write(() => {
                const results = realm.objects('Product');

                realm.delete(results);
            });
        } catch (err) {
            console.warn(err);
        }
    }

    async function getNot() {
        const noti = await getEnableNotifications();

        if (noti) {
            Alert.alert('Habilitado');
        } else {
            Alert.alert('Desabilitado');
        }
    }

    interface IProductImage {
        productId: number;
        imagePath: string;
        imageName: string;
    }

    const logFiles = useCallback(async () => {
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

        const targetPath = `${DocumentDirectoryPath}/backupfile.zip`;
        const sourcePath = `${DocumentDirectoryPath}/images`;

        const zipPath = await zip(sourcePath, targetPath);

        console.log(zipPath);
    }, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button text="Notification Status" onPress={getNot} />

                    <Button text="Load with sample data" onPress={sampleData} />

                    <Button
                        text="Delete all products"
                        onPress={deleteProducts}
                    />

                    <Button text="Log files" onPress={logFiles} />
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
