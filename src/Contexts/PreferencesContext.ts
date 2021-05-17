import { createContext } from 'react';

import { NotificationCadency } from '../Functions/Settings';
import Themes from '../Themes';

const PreferencesContext = createContext({
    userPreferences: {
        howManyDaysToBeNextToExpire: 30,
        appTheme: Themes.Light,
        enableNotifications: true,
        notificationCadency: NotificationCadency.Day,
        enableDrawerMenu: false,
        user: {
            displayName: '',

            email: '',
            emailVerified: false,

            photoURL: '',
            providerId: '',
            uid: '',
        },
        selectedTeam: {
            role: '',
            team: {
                id: '',
                name: '',
            },
        },
    },
    setUserPreferences: ({
        howManyDaysToBeNextToExpire,
        appTheme,
        enableNotifications,
        enableDrawerMenu,
        notificationCadency,
        user,
        selectedTeam,
    }: IUserPreferences) => {},
});

export default PreferencesContext;
