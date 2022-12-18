import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAppTheme(): Promise<string> {
    const setting = await AsyncStorage.getItem('AppTheme');

    if (!setting) {
        return 'system';
    }

    return setting;
}

export async function setAppTheme(themeName: string): Promise<void> {
    await AsyncStorage.setItem('AppTheme', themeName);
}
