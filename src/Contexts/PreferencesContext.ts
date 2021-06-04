import { createContext } from 'react';

import DefaultPrefs from './DefaultPreferences';

const Preferences = createContext({
    preferences: DefaultPrefs,
    setPreferences: ({
        howManyDaysToBeNextToExpire,
        appTheme,
        enableNotifications,
        notificationCadency,
        user,
        selectedTeam,
    }: IPreferences) => {},
});

export default Preferences;
