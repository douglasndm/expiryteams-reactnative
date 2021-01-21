import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnixTime, fromUnixTime, addDays, addMinutes } from 'date-fns';

import {
    getNotificationCadency,
    NotificationCadency,
} from '~/Functions/Settings';

export async function setTimeForNextNotification(): Promise<void> {
    const date = __DEV__ ? addMinutes(new Date(), 15) : addDays(new Date(), 1);

    const timestamp = getUnixTime(date);

    try {
        await AsyncStorage.setItem(
            'timeForNextNotification',
            String(timestamp)
        );
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function isTimeForANotification(): Promise<boolean> {
    try {
        const notificationCadency = await getNotificationCadency();

        if (notificationCadency === NotificationCadency.Never) {
            return false;
        }

        const timestamp = await AsyncStorage.getItem('timeForNextNotification');

        if (timestamp) {
            const date = fromUnixTime(Number(timestamp));

            if (new Date() > date) {
                return true;
            }

            return false;
        }

        await setTimeForNextNotification();
        return false;
    } catch (err) {
        throw new Error(err.message);
    }
}
