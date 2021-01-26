import { Platform } from 'react-native';
import BackgroundJob from 'react-native-background-fetch';

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
    BackgroundJob.configure(
        {
            minimumFetchInterval: 15,
            // Android options
            forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
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

            // Required: Signal completion of your task to native code
            // If you fail to do this, the OS can terminate your app
            // or assign battery-blame for consuming too much background-time
            BackgroundJob.finish(taskId);
        },
        (error) => {
            console.log(`[js] RNBackgroundFetch failed to start: ${error}`);
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
