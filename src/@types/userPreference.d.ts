import { DefaultTheme } from 'styled-components';

interface IUserPreferences {
    howManyDaysToBeNextToExpire: number;
    isUserPremium: boolean;
    appTheme: DefaultTheme;
    multiplesStores: boolean;
    enableNotifications: boolean;
    isUserSignedIn: boolean;
}
