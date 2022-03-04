/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { showMessage } from 'react-native-flash-message';

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

messaging().onMessage(async remoteMessage => {
    const { title, body } = remoteMessage.notification;

    showMessage({
        message: title,
        description: body,
        type: 'info',
    });
});

AppRegistry.registerComponent(appName, () => App);
