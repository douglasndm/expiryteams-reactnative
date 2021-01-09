import { IUserPreferences } from '../@types/userPreference';
import { getThemeByName } from '../Themes';

import { isUserSignedIn } from './Auth/Google';
import {
    getAppTheme,
    getEnableMultipleStoresMode,
    getEnableNotifications,
    getNotificationCadency,
    getEnableProVersion,
    getHowManyDaysToBeNextExp,
} from './Settings';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
    try {
        const settingDay = await getHowManyDaysToBeNextExp();
        const settingTheme = await getAppTheme();
        const settingNotification = await getEnableNotifications();
        const settingMultipleStores = await getEnableMultipleStoresMode();
        const settingNotificationCadency = await getNotificationCadency();
        const settingProMode = await getEnableProVersion();
        const signedUser = await isUserSignedIn();

        const settings: IUserPreferences = {
            howManyDaysToBeNextToExpire: settingDay,
            appTheme: getThemeByName(settingTheme),
            enableNotifications: settingNotification,
            notificationCadency: settingNotificationCadency,
            isUserPremium: settingProMode,
            multiplesStores: settingMultipleStores,
            isUserSignedIn: signedUser,
        };

        return settings;
    } catch (err) {
        throw new Error(err);
    }
}
