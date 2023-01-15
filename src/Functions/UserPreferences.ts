import { getThemeByName } from '@themes/index';

import { IUserPreferences } from '@teams/@types/userPreference';

import {
	getEnableNotifications,
	getHowManyDaysToBeNextExp,
	getAutoComplete,
} from './Settings';

import { getAppTheme } from './Themes';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
	const settingDay = await getHowManyDaysToBeNextExp();
	const settingTheme = await getAppTheme();
	const settingAutoComplete = await getAutoComplete();
	const settingNotification = await getEnableNotifications();

	const settings: IUserPreferences = {
		howManyDaysToBeNextToExpire: settingDay,
		autoComplete: settingAutoComplete,
		appTheme: getThemeByName(settingTheme, true),
		enableNotifications: settingNotification,
	};

	return settings;
}
