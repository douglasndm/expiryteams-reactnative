import { getThemeByName } from '../Themes';

import { IUserPreferences } from '~/@types/userPreference';

import {
    getEnableNotifications,
    getNotificationCadency,
    getHowManyDaysToBeNextExp,
    getAutoComplete,
} from './Settings';

import { getAppTheme } from './Themes';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
    const settingDay = await getHowManyDaysToBeNextExp();
    const settingTheme = await getAppTheme();
    const settingAutoComplete = await getAutoComplete();
    const settingNotification = await getEnableNotifications();
    const settingNotificationCadency = await getNotificationCadency();

    const settings: IUserPreferences = {
        howManyDaysToBeNextToExpire: settingDay,
        autoComplete: settingAutoComplete,
        appTheme: getThemeByName(settingTheme),
        enableNotifications: settingNotification,
        notificationCadency: settingNotificationCadency,
    };

    return settings;
}
