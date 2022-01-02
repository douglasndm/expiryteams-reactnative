/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'new NativeEventEmitter()']);

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
        'Message handled in the background!',
        JSON.stringify(remoteMessage)
    );
});

AppRegistry.registerComponent(appName, () => App);
