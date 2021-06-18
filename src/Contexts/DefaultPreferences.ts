import { NotificationCadency } from '~/Functions/Settings';

import Themes from '~/Themes';

const obj: IPreferences = {
    howManyDaysToBeNextToExpire: 30,
    appTheme: Themes.Light,
    enableNotifications: true,
    notificationCadency: NotificationCadency.Day,

    selectedTeam: {
        role: '',
        status: 'Pending',
        team: {
            id: '',
            name: '',
            active: false,
        },
    },
};

export default obj;
