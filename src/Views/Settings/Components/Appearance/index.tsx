import React, { useState, useCallback, useContext, useMemo } from 'react';

import { translate } from '~/Locales';
import { getActualAppTheme } from '~/Themes';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { setAppTheme } from '~/Functions/Settings';

import { Category, CategoryOptions, CategoryTitle, Picker } from '../../styles';
import { Text, PickerContainer } from './styles';

interface IThemeItem {
    label: string;
    value: string;
    key: string;
}

const Appearance: React.FC = () => {
    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [selectedTheme, setSelectedTheme] = useState<string>('system');

    const data = useMemo(() => {
        const availableThemes: Array<IThemeItem> = [];

        availableThemes.push({
            label: translate('View_Settings_Appearance_Theme_System'),
            value: 'system',
            key: 'system',
        });
        availableThemes.push({
            label: translate('View_Settings_Appearance_Theme_Light'),
            value: 'light',
            key: 'light',
        });
        availableThemes.push({
            label: translate('View_Settings_Appearance_Theme_Dark'),
            value: 'dark',
            key: 'dark',
        });

        if (userPreferences.isUserPremium) {
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_UltraViolet'),
                value: 'ultraviolet',
                key: 'ultraviolet',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_DarkGreen'),
                value: 'darkgreen',
                key: 'darkgreen',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_HappyPink'),
                value: 'happypink',
                key: 'happypink',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_OceanBlue'),
                value: 'oceanblue',
                key: 'oceanblue',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_Relax'),
                value: 'relax',
                key: 'relax',
            });
        }

        return availableThemes;
    }, [userPreferences.isUserPremium]);

    const handleThemeChange = useCallback(
        async (themeName: string) => {
            if (themeName === 'null') {
                return;
            }
            setSelectedTheme(themeName);
            await setAppTheme(themeName);

            const changeToTheme = await getActualAppTheme();

            setUserPreferences({
                ...userPreferences,
                appTheme: changeToTheme,
            });
        },
        [setUserPreferences, userPreferences]
    );

    return (
        <Category>
            <CategoryTitle>
                {translate('View_Settings_CategoryName_Appearance')}
            </CategoryTitle>

            <CategoryOptions>
                <Text>{translate('View_Settings_SettingName_AppTheme')}</Text>
                <PickerContainer>
                    <Picker
                        items={data}
                        onValueChange={handleThemeChange}
                        value={selectedTheme}
                        placeholder={{
                            label: 'Selecione um item',
                            value: 'null',
                        }}
                    />
                </PickerContainer>
            </CategoryOptions>
        </Category>
    );
};

export default Appearance;
