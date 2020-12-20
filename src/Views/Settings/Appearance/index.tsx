import React, { useState, useCallback, useContext } from 'react';

import { translate } from '../../../Locales';

import { setAppTheme } from '../../../Functions/Settings';

import { getActualAppTheme } from '../../../Themes';

import PreferencesContext from '../../../Contexts/PreferencesContext';

import { CategoryOptions, CategoryTitle } from '../styles';
import { Text, PickerContainer, Picker } from './styles';

const Appearance: React.FC = () => {
    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [selectedTheme, setSelectedTheme] = useState<string>('system');

    const handleThemeChange = useCallback(
        async (themeName: string) => {
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
        <CategoryOptions>
            <CategoryTitle>
                {translate('View_Settings_CategoryName_Appearance')}
            </CategoryTitle>

            <PickerContainer>
                <Text>{translate('View_Settings_SettingName_AppTheme')}</Text>

                <Picker
                    mode="dropdown"
                    selectedValue={selectedTheme}
                    onValueChange={(value) => {
                        handleThemeChange(String(value));
                    }}
                >
                    <Picker.Item
                        label={translate(
                            'View_Settings_Appearance_Theme_System'
                        )}
                        value="system"
                    />
                    <Picker.Item
                        label={translate(
                            'View_Settings_Appearance_Theme_Light'
                        )}
                        value="light"
                    />
                    <Picker.Item
                        label={translate('View_Settings_Appearance_Theme_Dark')}
                        value="dark"
                    />
                    {userPreferences.isUserPremium || __DEV__ ? (
                        <Picker.Item
                            label={translate(
                                'View_Settings_Appearance_Theme_UltraViolet'
                            )}
                            value="ultraviolet"
                        />
                    ) : null}

                    {
                        // I CANT USE FRAGMENT SO I NEED TO DO EACH PICKER WITH IT OWN 'IF' WHY RN???
                        userPreferences.isUserPremium || __DEV__ ? (
                            <Picker.Item
                                label={translate(
                                    'View_Settings_Appearance_Theme_DarkGreen'
                                )}
                                value="darkgreen"
                            />
                        ) : null
                    }

                    {userPreferences.isUserPremium || __DEV__ ? (
                        <Picker.Item
                            label={translate(
                                'View_Settings_Appearance_Theme_HappyPink'
                            )}
                            value="happypink"
                        />
                    ) : null}

                    {userPreferences.isUserPremium || __DEV__ ? (
                        <Picker.Item
                            label={translate(
                                'View_Settings_Appearance_Theme_OceanBlue'
                            )}
                            value="oceanblue"
                        />
                    ) : null}

                    {userPreferences.isUserPremium ||
                        (__DEV__ && (
                            <Picker.Item
                                label={translate(
                                    'View_Settings_Appearance_Theme_Relax'
                                )}
                                value="relax"
                            />
                        ))}

                    {userPreferences.isUserPremium ||
                        (__DEV__ && (
                            <Picker.Item
                                label={translate(
                                    'View_Settings_Appearance_Theme_Florest'
                                )}
                                value="florest"
                            />
                        ))}
                </Picker>
            </PickerContainer>
        </CategoryOptions>
    );
};

export default Appearance;
