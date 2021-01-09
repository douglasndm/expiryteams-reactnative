import { Platform } from 'react-native';
import BackgroundJob from 'react-native-background-job';

import { getNotificationForAllProductsCloseToExp } from '../Functions/ProductsNotifications';

import { sendNotification } from './Notifications';

const handleSetNotification = async () => {
    const notification = await getNotificationForAllProductsCloseToExp();

    if (notification) {
        sendNotification(notification);
    }
};

if (Platform.OS === 'android') {
    // REGISTRA O SERVIÇO QUE VAI RODAR AS NOTIFICAÇÕES
    const backgroundJob = {
        jobKey: 'backgroundNotification',
        job: handleSetNotification,
    };

    BackgroundJob.register(backgroundJob);

    const backgroundSchedule = {
        jobKey: 'backgroundNotification',
        period: __DEV__ ? 900000 : 86400000,
        allowExecutionInForeground: true,
    };

    BackgroundJob.schedule(backgroundSchedule)
        .then(() => console.log(backgroundSchedule))
        .catch((err) => {
            throw new Error(err);
        });
}
