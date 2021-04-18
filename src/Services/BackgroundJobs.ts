import { Platform } from 'react-native';
import BackgroundJob from 'react-native-background-fetch';
import Analytics from '@react-native-firebase/analytics';

import {
    isTimeForANotification,
    setTimeForNextNotification,
} from '~/Functions/Notifications';

import { getNotificationForAllProductsCloseToExp } from '../Functions/ProductsNotifications';

import { sendNotification } from './Notifications';

const handleSetNotification = async () => {
    const notificationTime = await isTimeForANotification();

    if (notificationTime) {
        // schedule next notification
        await setTimeForNextNotification();

        const notification = await getNotificationForAllProductsCloseToExp();

        if (notification) {
            sendNotification(notification);
        }
    }
};

async function configureBackgroundJob() {
    let period = 15;

    // This is set alarm mode, and will cost more battery so, on android we will use 1 hour to check
    // updates, ios and dev still continue with 15 minutes
    if (Platform.OS === 'android' && !__DEV__) {
        period = 60;
    }

    BackgroundJob.configure(
        {
            minimumFetchInterval: period, // <-- minutes (15 is minimum allowed)
            // Android options
            forceAlarmManager: true, // <-- Set true to bypass JobScheduler.
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundJob.NETWORK_TYPE_NONE, // Default
            requiresCharging: false, // Default
            requiresDeviceIdle: false, // Default
            requiresBatteryNotLow: false, // Default
            requiresStorageNotLow: false, // Default
        },
        async (taskId) => {
            console.log(
                `${Platform.OS} => [js] Received background-fetch event: `,
                taskId
            );
            await handleSetNotification();

            await Analytics().logEvent('Notification_sent');

            // Required: Signal completion of your task to native code
            // If you fail to do this, the OS can terminate your app
            // or assign battery-blame for consuming too much background-time
            BackgroundJob.finish(taskId);
        },
        async (error) => {
            console.log(`[js] RNBackgroundFetch failed to start: ${error}`);

            await Analytics().logEvent('Error_while_send_Notification', {
                error,
            });
        }
    );

    // Optional: Query the authorization status.
    BackgroundJob.status((status) => {
        switch (status) {
            case BackgroundJob.STATUS_RESTRICTED:
                console.log('BackgroundFetch restricted');
                break;
            case BackgroundJob.STATUS_DENIED:
                console.log('BackgroundFetch denied');
                break;
            case BackgroundJob.STATUS_AVAILABLE:
                console.log('BackgroundFetch is enabled');
                break;
            default:
                console.log('default');
        }
    });
}

configureBackgroundJob();
