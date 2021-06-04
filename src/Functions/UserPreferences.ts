import auth from '@react-native-firebase/auth';
import { getThemeByName } from '../Themes';

import {
    getEnableNotifications,
    getNotificationCadency,
    getHowManyDaysToBeNextExp,
} from './Settings';
import { getAppTheme } from './Themes';
import { getSelectedTeam } from '~/Functions/Team/SelectedTeam';

export async function getAllUserPreferences(): Promise<IPreferences> {
    try {
        const settingDay = await getHowManyDaysToBeNextExp();
        const settingTheme = await getAppTheme();
        const settingNotification = await getEnableNotifications();
        const settingNotificationCadency = await getNotificationCadency();
        const userSession = auth().currentUser;
        const selectedTeam = await getSelectedTeam();

        const settings: IPreferences = {
            howManyDaysToBeNextToExpire: settingDay,
            appTheme: getThemeByName(settingTheme),
            enableNotifications: settingNotification,
            notificationCadency: settingNotificationCadency,
            user: userSession,
            selectedTeam,
        };

        return settings;
    } catch (err) {
        throw new Error(err);
    }
}
