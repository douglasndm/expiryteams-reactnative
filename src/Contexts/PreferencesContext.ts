import { createContext } from 'react';

import { IUserPreferences } from '~/@types/userPreference';

import DefaultPrefs from './DefaultPreferences';

const Preferences = createContext({
    preferences: DefaultPrefs,
    setPreferences: ({
        howManyDaysToBeNextToExpire,
        appTheme,
        autoComplete,
        enableNotifications,
        notificationCadency,
    }: IUserPreferences) => {},
});

export default Preferences;
