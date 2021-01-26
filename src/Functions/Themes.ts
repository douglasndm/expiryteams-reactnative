import AsyncStorage from '@react-native-async-storage/async-storage';

import { getEnableProVersion } from './Settings';

export async function getAppTheme(): Promise<string> {
    const isUserPro = await getEnableProVersion();

    if (isUserPro) {
        const proTheme = await AsyncStorage.getItem('AppThemePRO');

        if (!proTheme) {
            return 'system';
        }

        return proTheme;
    }

    const setting = await AsyncStorage.getItem('AppTheme');

    if (!setting) {
        return 'system';
    }

    return setting;
}

export async function setAppTheme(themeName: string): Promise<void> {
    try {
        const isUserPro = await getEnableProVersion();

        if (isUserPro) {
            await AsyncStorage.setItem('AppThemePRO', themeName);

            // this if makes sure if user select a non-pro theme it will still be selected if
            // user cancel pro mode
            if (
                themeName === 'system' ||
                themeName === 'light' ||
                themeName === 'dark'
            ) {
                await AsyncStorage.setItem('AppTheme', themeName);
            }

            // return to not set apptheme again with possible pro themes
            return;
        }

        await AsyncStorage.setItem('AppTheme', themeName);
    } catch (err) {
        throw new Error(err.message);
    }
}
