import BackgroundJob from 'react-native-background-job';
import { Platform } from 'react-native';

import { getAllProductsNextToExp } from '../Functions/ProductsNotifications';

if (Platform.OS === 'android') {
    // REGISTRA O SERVIÇO QUE VAI RODAR AS NOTIFICAÇÕES
    const backgroundJob = {
        jobKey: 'backgroundNotification',
        job: () => {
            getAllProductsNextToExp();
        },
    };
    BackgroundJob.register(backgroundJob);

    const backgroundSchedule = {
        jobKey: 'backgroundNotification',
        period: __DEV__ ? 900000 : 86400000,
        allowExecutionInForeground: true,
    };

    BackgroundJob.schedule(backgroundSchedule)
        .then(() => console.log('Success'))
        .catch((err) => {
            throw new Error(err);
        });
}
