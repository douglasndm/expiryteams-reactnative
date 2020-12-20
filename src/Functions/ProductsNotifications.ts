import { Notifications } from 'react-native-notifications';
import { addDays, isPast } from 'date-fns';
import crashlytics from '@react-native-firebase/crashlytics';

import { translate } from '../Locales';

import { getHowManyDaysToBeNextExp, getEnableNotifications } from './Settings';
import {
    getAllProducts,
    removeAllLotesTratadosFromAllProduts,
} from './Products';

export async function getAllProductsNextToExp(): Promise<void> {
    const isNotifcationEnabled = await getEnableNotifications();

    if (!isNotifcationEnabled) return;

    const daysToBeNext = await getHowManyDaysToBeNextExp();

    try {
        const prods = await getAllProducts({
            removeProductsWithoutBatches: true,
        });
        const products = removeAllLotesTratadosFromAllProduts(prods);

        const productsNextFiltered = products.map((p) => {
            const lotes = p.lotes.slice();

            const lotesFiltered = lotes.filter((l) => {
                if (
                    l.exp_date < addDays(new Date(), daysToBeNext) &&
                    !isPast(l.exp_date) &&
                    l.status !== 'Tratado'
                ) {
                    return true;
                }

                return false;
            });

            return {
                ...p,
                lotes: lotesFiltered,
            };
        });

        const productsVencidosFiltered = products.map((p) => {
            const lotes = p.lotes.slice();

            const lotesFiltered = lotes.filter((l) => {
                if (isPast(l.exp_date) && l.status !== 'Tratado') {
                    return true;
                }

                return false;
            });

            return {
                ...p,
                lotes: lotesFiltered,
            };
        });

        let productsNextToExpCount = 0;
        let productsVencidosCount = 0;

        productsNextFiltered.forEach((p) => {
            productsNextToExpCount += p.lotes.length;
        });

        productsVencidosFiltered.forEach((p) => {
            productsVencidosCount += p.lotes.length;
        });

        let NotificationTitle;
        let NotificationMessage;

        if (productsNextToExpCount > 0 && productsVencidosCount === 0) {
            NotificationTitle = translate(
                'Function_Notification_ItOnlyHasProductsNextToExpTitle'
            );
            NotificationMessage = translate(
                'Function_Notification_ItOnlyHasProductsNextToExpMessage'
            ).replace('{NUMBER}', String(productsNextToExpCount));
        } else if (productsNextToExpCount === 0 && productsVencidosCount > 0) {
            NotificationTitle = translate(
                'Function_Notification_ItOnlyHasExpiredProductsTitle'
            );
            NotificationMessage = translate(
                'Function_Notification_ItOnlyHasExpiredProductsMessage'
            ).replace('{NUMBER}', String(productsVencidosCount));
        } else if (productsNextToExpCount > 0 && productsVencidosCount > 0) {
            NotificationTitle = translate(
                'Function_Notification_ItHasExpiredAndNextToExpireProductsTitle'
            );
            NotificationMessage = translate(
                'Function_Notification_ItHasExpiredAndNextToExpireProductsMessage'
            )
                .replace('{EXPIREDNUMBER}', String(productsVencidosCount))
                .replace('{NEXTBATCHES}', String(productsNextToExpCount));
        }

        if (!!NotificationTitle && !!NotificationMessage) {
            Notifications.postLocalNotification(
                {
                    title: NotificationTitle,
                    body: NotificationMessage,
                },
                1
            );
        }
    } catch (err) {
        crashlytics().recordError(err);
        crashlytics().log('Falha ao enviar notificação');
        throw new Error(err);
    }
}
