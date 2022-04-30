import { DefaultTheme } from 'styled-components';

interface IUserPreferences {
    howManyDaysToBeNextToExpire: number;
    appTheme: DefaultTheme;
    autoComplete: boolean;
    enableNotifications: boolean;
    notificationCadency: NotificationCadency;
    selectedTeam: IUserRoles | null;
}
