import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { addSeconds, addMinutes, addDays } from 'date-fns';

import { getEnableNotifications } from './Settings';
import { getNotificationForAllProductsCloseToExp } from './ProductsNotifications';

async function ScheduleNotification() {
    const isNotifcationEnabled = await getEnableNotifications();
    if (!isNotifcationEnabled) return;

    const notification = await getNotificationForAllProductsCloseToExp();

    if (notification) {
        let timeForNotification = null;

        // CASO EM DEBUG AS NOTIFICAÇÕES VÃO SER DISPIRADAS A CADA 15 MINUTOS PARA TESTES
        if (__DEV__) {
            timeForNotification = new Date(addSeconds(Date.now(), 15));
        } else {
            timeForNotification = new Date(addDays(Date.now(), 1));
        }

        PushNotification.localNotificationSchedule({
            date: timeForNotification,
            title: notification.title,
            message: notification.message,
            channelId: 'default-notifications',
            color: 'red',
            vibrate: true,
            importance: 'high',
            playSound: true,
            soundName: Platform.OS === 'ios' ? 'swiftly-610.m4r' : 'sound.mp3',
            number: notification.amount ? notification.amount : 0,
        });
    }
}

ScheduleNotification();
