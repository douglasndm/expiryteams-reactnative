/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';

import '@services/Notifications';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

import Sentry from './src/Services/Sentry';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'new NativeEventEmitter()']);

const sentry = Sentry.wrap(App);

AppRegistry.registerComponent(appName, () => sentry);
