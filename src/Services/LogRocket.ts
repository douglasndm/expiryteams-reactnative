import LogRocket from '@logrocket/react-native';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

if (!__DEV__) {
    LogRocket.init(Config.LOGROCKET_APP_ID);

    LogRocket.getSessionURL(sessionURL => {
        Sentry.configureScope(scope => {
            scope.setExtra('sessionURL', sessionURL);
        });
    });
}
