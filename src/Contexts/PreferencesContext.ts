import { createContext } from 'react';
import Themes from '../Themes';

const PreferencesContext = createContext({
    userPreferences: {
        howManyDaysToBeNextToExpire: 30,
        isUserPremium: false,
        appTheme: Themes.Light,
        multiplesStores: false,
        enableNotifications: true,
        isUserSignedIn: false,
    },
    setUserPreferences: ({
        howManyDaysToBeNextToExpire,
        isUserPremium,
        appTheme,
        multiplesStores,
        enableNotifications,
        isUserSignedIn,
    }: IUserPreferences) => {},
});

export default PreferencesContext;
