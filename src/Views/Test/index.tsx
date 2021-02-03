import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { DocumentDirectoryPath, readDir } from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { zip } from 'react-native-zip-archive';
import { addDays } from 'date-fns';
import {
    RewardedAd,
    TestIds,
    RewardedAdEventType,
} from '@react-native-firebase/admob';

import Realm from '../../Services/Realm';

import Button from '../../Components/Button';

import { Container, Category } from '../Settings/styles';
import { getAllProducts } from '~/Functions/Products';
import {
    isTimeForANotification,
    setTimeForNextNotification,
} from '~/Functions/Notifications';

import { getNotificationForAllProductsCloseToExp } from '~/Functions/ProductsNotifications';
import { sendNotification } from '~/Services/Notifications';

const rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);

const Test: React.FC = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const eventListener = rewardedAd.onAdEvent((type, error, reward) => {
            if (type === RewardedAdEventType.LOADED) {
                setLoaded(true);
            }

            if (type === RewardedAdEventType.EARNED_REWARD) {
                console.log('User earned reward of ', reward);
                setLoaded(false);
            }
        });

        // Start loading the rewarded ad straight away
        rewardedAd.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, []);

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

    const rewardAd = useCallback(() => {
        if (loaded) {
            rewardedAd.show();
            rewardedAd.load();
        }
    }, [loaded]);

    const handleNotification = useCallback(async () => {
        await setTimeForNextNotification();

        const notification = await getNotificationForAllProductsCloseToExp();

        if (notification) {
            sendNotification(notification);
        }
    }, []);

    const handleDeletePrivacySetting = useCallback(async () => {
        await AsyncStorage.removeItem('Privacy/canUseIDFA');
    }, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button text="Load with sample data" onPress={sampleData} />

                    <Button
                        text="Delete all products"
                        onPress={deleteProducts}
                    />

                    <Button text="Log files" onPress={logFiles} />

                    <Button text="Show rewards ad" onPress={rewardAd} />

                    <Button
                        text="Log is time to notificaiton"
                        onPress={() =>
                            isTimeForANotification().then((response) =>
                                console.log(response)
                            )
                        }
                    />

                    <Button
                        text="Throw notification"
                        onPress={handleNotification}
                    />

                    <Button
                        text="Delete privacy setting"
                        onPress={handleDeletePrivacySetting}
                    />
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
