import messaging from '@react-native-firebase/messaging';

async function requestUserPermission(): Promise<void> {
    const authStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        announcement: true,
        sound: true,
    });
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // if (enabled) {
    //     console.log('Authorization status:', authStatus);
    // }
}

requestUserPermission();
