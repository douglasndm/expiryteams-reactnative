import { NotificationCadency } from '~/Functions/Settings';

import { IUserPreferences } from '~/@types/userPreference';

import Themes from '~/Themes';

const obj: IUserPreferences = {
    howManyDaysToBeNextToExpire: 30,
    appTheme: Themes.Light,
    autoComplete: false,
    enableNotifications: true,
    notificationCadency: NotificationCadency.Day,
    selectedTeam: null,
};

export default obj;
