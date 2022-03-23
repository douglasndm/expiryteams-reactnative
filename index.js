/**
 * @format
 */

import { AppRegistry, LogBox, Linking } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { showMessage } from 'react-native-flash-message';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

import Sentry from './src/Services/Sentry';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'new NativeEventEmitter()']);

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
        'Message handled in the background!',
        JSON.stringify(remoteMessage)
    );
});

messaging().onNotificationOpenedApp(async remoteMessage => {
    if (remoteMessage.data.deeplinking) {
        await Linking.openURL(remoteMessage.data.deeplinking);
    }
});

messaging().onMessage(async remoteMessage => {
    async function onOpen() {
        if (remoteMessage.data.deeplinking) {
            await Linking.openURL(remoteMessage.data.deeplinking);
        }
    }

    showMessage({
        message: remoteMessage.notification.title,
        description: remoteMessage.notification.body,
        onPress: onOpen,
    });
});

const sentry = Sentry.wrap(App);

AppRegistry.registerComponent(appName, () => sentry);
