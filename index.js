/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';

import { requestNotificationPermission } from '@services/Notifications/Permission';
import '@services/Notifications';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'new NativeEventEmitter()']);

requestNotificationPermission();

AppRegistry.registerComponent(appName, () => App);
