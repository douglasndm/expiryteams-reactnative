import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { addDays } from 'date-fns';

import { useTheme } from 'styled-components/native';

import Realm from '../../Services/Realm';

import Button from '../../Components/Button';

import {
    getEnableNotifications,
    setEnableNotifications,
} from '../../Functions/Settings';
// import * as Premium from '../../Functions/Premium';
import { ExportBackupFile, ImportBackupFile } from '../../Functions/Backup';
import { throwNotificationAllProductsCloseToExp } from '../../Functions/ProductsNotifications';
import { Category } from '../Settings/styles';

const Test: React.FC = () => {
    function note() {
        throwNotificationAllProductsCloseToExp();
    }

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

    async function saveFile() {
        ExportBackupFile();
    }

    async function getNot() {
        const noti = await getEnableNotifications();

        if (noti) {
            Alert.alert('Habilitado');
        } else {
            Alert.alert('Desabilitado');
        }
    }

    async function setNot() {
        const noti = await getEnableNotifications();

        await setEnableNotifications(!noti);
    }

    const theme = useTheme();

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <ScrollView>
                <Category
                    style={{ backgroundColor: theme.colors.productBackground }}
                >
                    <Button text="Notification Status" onPress={getNot} />
                    <Button
                        text="Invert Notification Status"
                        onPress={setNot}
                    />

                    <Button
                        text="Disparar notificação"
                        onPress={() => note()}
                    />

                    <Button
                        text="Load with sample data"
                        onPress={() => sampleData()}
                    />

                    <Button
                        text="Delete all products"
                        onPress={() => {
                            deleteProducts();
                        }}
                    />

                    <Button
                        text="Import file"
                        onPress={() => {
                            ImportBackupFile();
                        }}
                    />

                    <Button
                        text="Export file"
                        onPress={() => {
                            saveFile();
                        }}
                    />
                </Category>
            </ScrollView>
        </View>
    );
};

export default Test;
