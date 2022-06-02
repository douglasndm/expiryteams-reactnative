import LogRocket from '@logrocket/react-native';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

if (!__DEV__) {
    getSelectedTeam().then(response => {
        if (response) {
            LogRocket.init(Config.LOGROCKET_APP_ID);

            LogRocket.getSessionURL(sessionURL => {
                Sentry.configureScope(scope => {
                    scope.setExtra('sessionURL', sessionURL);
                });
            });
        }
    });
}
