import * as Sentry from '@sentry/react-native';
import EnvConfig from 'react-native-config';

Sentry.init({
    dsn: EnvConfig.SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    enabled: !__DEV__,
});

export default Sentry;
