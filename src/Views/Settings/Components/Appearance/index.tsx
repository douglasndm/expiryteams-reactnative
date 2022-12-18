import React, {
    useState,
    useCallback,
    useContext,
    useMemo,
    useEffect,
} from 'react';

import strings from '~/Locales';

import { getActualAppTheme, Themes } from '@themes/index';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { setAppTheme, getAppTheme } from '~/Functions/Themes';

import { Category, CategoryOptions, CategoryTitle, Picker } from '../../styles';
import { Text, PickerContainer } from './styles';

interface IThemeItem {
    label: string;
    value: string;
    key: string;
}

const Appearance: React.FC = () => {
    const { preferences, setPreferences } = useContext(PreferencesContext);

    const [selectedTheme, setSelectedTheme] = useState<string>('system');

    const data = useMemo(() => {
        const availableThemes: Array<IThemeItem> = [];

        availableThemes.push({
            label: strings.View_Settings_Appearance_Theme_System,
            value: 'system',
            key: 'system',
        });

        Themes.forEach(theme => {
            availableThemes.push({
                label: theme.name,
                key: theme.key,
                value: theme.key,
            });
        });

        return availableThemes;
    }, []);

    useEffect(() => {
        getAppTheme().then(response => setSelectedTheme(response));
    }, []);

    const handleThemeChange = useCallback(
        async (themeName: string) => {
            if (themeName === 'null') {
                return;
            }
            setSelectedTheme(themeName);
            await setAppTheme(themeName);

            const changeToTheme = await getActualAppTheme();


            setPreferences({
                ...preferences,
                appTheme: changeToTheme,
            });
        },
        [setPreferences, preferences]
    );

    return (
        <Category>
            <CategoryTitle>
                {strings.View_Settings_CategoryName_Appearance}
            </CategoryTitle>

            <CategoryOptions>
                <Text>{strings.View_Settings_SettingName_AppTheme}</Text>
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
