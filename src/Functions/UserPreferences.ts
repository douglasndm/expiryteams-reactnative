import auth from '@react-native-firebase/auth';
import { IUserPreferences } from '../@types/userPreference';
import { getThemeByName } from '../Themes';

import {
    getEnableNotifications,
    getNotificationCadency,
    getHowManyDaysToBeNextExp,
} from './Settings';
import { getAppTheme } from './Themes';
import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
    try {
        const settingDay = await getHowManyDaysToBeNextExp();
        const settingTheme = await getAppTheme();
        const settingNotification = await getEnableNotifications();
        const settingNotificationCadency = await getNotificationCadency();
        const userSession = auth().currentUser;
        const selectedTeam = await getSelectedTeam();

        const settings: IUserPreferences = {
            howManyDaysToBeNextToExpire: settingDay,
            appTheme: getThemeByName(settingTheme),
            enableNotifications: settingNotification,
            enableDrawerMenu: false,
            notificationCadency: settingNotificationCadency,
            user: userSession,
            selectedTeam,
        };

        return settings;
    } catch (err) {
        throw new Error(err);
    }
}
