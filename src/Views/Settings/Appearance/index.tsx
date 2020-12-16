import React, { useState, useCallback, useContext } from 'react';

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
            <CategoryTitle>Aparência</CategoryTitle>

            <PickerContainer>
                <Text>Tema do aplicativo</Text>

                <Picker
                    mode="dropdown"
                    selectedValue={selectedTheme}
                    onValueChange={(value) => {
                        handleThemeChange(String(value));
                    }}
                >
                    <Picker.Item
                        label="Baseado no sistema (Padrão)"
                        value="system"
                    />
                    <Picker.Item label="Claro" value="light" />
                    <Picker.Item label="Escuro" value="dark" />
                    {userPreferences.isUserPremium || __DEV__ ? (
                        <Picker.Item
                            label="Ultra violeta (Premium)"
                            value="ultraviolet"
                        />
                    ) : null}

                    {
                        // I CANT USE FRAGMENT SO I NEED TO DO EACH PICKER WITH IT OWN 'IF' WHY RN???
                        userPreferences.isUserPremium || __DEV__ ? (
                            <Picker.Item
                                label="Dark Green (Premium)"
                                value="darkgreen"
                            />
                        ) : null
                    }

                    {userPreferences.isUserPremium || __DEV__ ? (
                        <Picker.Item
                            label="Happy Pink (Premium)"
                            value="happypink"
                        />
                    ) : null}

                    {userPreferences.isUserPremium || __DEV__ ? (
                        <Picker.Item
                            label="Ocean Blue (Premium)"
                            value="oceanblue"
                        />
                    ) : null}

                    {userPreferences.isUserPremium ||
                        (__DEV__ && (
                            <Picker.Item
                                label="Relax (Premium)"
                                value="relax"
                            />
                        ))}
                </Picker>
            </PickerContainer>
        </CategoryOptions>
    );
};

export default Appearance;
