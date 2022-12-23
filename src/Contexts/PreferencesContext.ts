import { createContext } from 'react';

import { IUserPreferences } from '@teams/@types/userPreference';

import DefaultPrefs from './DefaultPreferences';

const Preferences = createContext({
	preferences: DefaultPrefs,
	setPreferences: ({
		howManyDaysToBeNextToExpire,
		appTheme,
		autoComplete,
		enableNotifications,
	}: IUserPreferences) => {},
});

export default Preferences;
