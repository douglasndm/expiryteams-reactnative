import { Platform } from 'react-native';
import AppsFlyer from 'react-native-appsflyer';
import { firebase } from '@react-native-firebase/messaging';
import EnvConfig from 'react-native-config';

let iosConfig = {};

if (Platform.OS === 'ios') {
    iosConfig = {
        appId: EnvConfig.IOS_APPID,
    };
}

AppsFlyer.initSdk({
    devKey: EnvConfig.APPSFLYER_DEV_KEY,
    isDebug: __DEV__,
    onInstallConversionDataListener: true,
    ...iosConfig,
})
    .then(async () => {
        console.log('AppsFlyer is running');

        const deviceToken = await firebase.messaging().getToken();

        if (deviceToken) {
            AppsFlyer.updateServerUninstallToken(deviceToken, (success) => {
                console.log('AppsFlyer called');
            });
        }
    })
    .catch((err) => console.log(err));
