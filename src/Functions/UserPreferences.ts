import { IUserPreferences } from '../@types/userPreference';
import { getThemeByName } from '../Themes';

import {
    getEnableMultipleStoresMode,
    getEnableNotifications,
    getNotificationCadency,
    getEnableProVersion,
    getHowManyDaysToBeNextExp,
} from './Settings';
import { getAppTheme } from './Themes';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
    try {
        const settingDay = await getHowManyDaysToBeNextExp();
        const settingTheme = await getAppTheme();
        const settingNotification = await getEnableNotifications();
        const settingMultipleStores = await getEnableMultipleStoresMode();
        const settingNotificationCadency = await getNotificationCadency();
        const settingProMode = await getEnableProVersion();

        const settings: IUserPreferences = {
            howManyDaysToBeNextToExpire: settingDay,
            appTheme: getThemeByName(settingTheme),
            enableNotifications: settingNotification,
            notificationCadency: settingNotificationCadency,
            isUserPremium: settingProMode,
            multiplesStores: settingMultipleStores,
        };

        return settings;
    } catch (err) {
        throw new Error(err);
    }
}
