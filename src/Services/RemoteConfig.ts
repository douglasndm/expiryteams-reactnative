import remoteConfig from '@react-native-firebase/remote-config';

async function init() {
    try {
        await remoteConfig().setDefaults({
            enable_app_bar: true,
            enable_app_bar_blur: true,

            enable_excel_import: false,
            enable_excel_export: true,

            enable_backup_import: false,
            enable_backup_export: false,
        });

        // if (__DEV__) {
        //     await remoteConfig().setConfigSettings({
        //         minimumFetchIntervalMillis: 5000,
        //     });
        // }

        await remoteConfig().fetchAndActivate();
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
}

init();
