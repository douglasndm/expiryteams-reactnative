import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';

import Appearance from './Components/Appearance';
import Notifications from './Components/Notifications';
import Account from './Components/Account';

import { setHowManyDaysToBeNextExp } from '~/Functions/Settings';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    SettingsContent,
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingContainer,
    SettingDescription,
    InputSetting,
} from './styles';

const Settings: React.FC = () => {
    const [daysToBeNext, setDaysToBeNext] = useState<string>('');

    const { preferences, setPreferences } = useContext(PreferencesContext);

    const { goBack } = useNavigation();

    const setSettingDaysToBeNext = useCallback(
        async (days: number) => {
            await setHowManyDaysToBeNextExp(days);

            setPreferences({
                ...preferences,
                howManyDaysToBeNextToExpire: days,
            });
        },
        [setPreferences, preferences]
    );

    useEffect(() => {
        setDaysToBeNext(String(preferences.howManyDaysToBeNextToExpire));
    }, [preferences]);

    useEffect(() => {
        async function SetNewDays() {
            const previousDaysToBeNext = String(
                preferences.howManyDaysToBeNextToExpire
            );

            if (!daysToBeNext || daysToBeNext === '') {
                return;
            }

            if (!!daysToBeNext && previousDaysToBeNext !== daysToBeNext) {
                await setSettingDaysToBeNext(Number(daysToBeNext));
            }
        }

        SetNewDays();
    }, [
        daysToBeNext,
        setSettingDaysToBeNext,
        preferences.howManyDaysToBeNextToExpire,
    ]);

    return (
        <>
            <Container>
                <StatusBar />
                <ScrollView>
                    <PageHeader>
                        <BackButton handleOnPress={goBack} />

                        <PageTitle>
                            {translate('View_Settings_PageTitle')}
                        </PageTitle>
                    </PageHeader>

                    <SettingsContent>
                        <Category>
                            <CategoryTitle>
                                {translate(
                                    'View_Settings_CategoryName_General'
                                )}
                            </CategoryTitle>

                            <CategoryOptions>
                                <SettingDescription>
                                    {translate(
                                        'View_Settings_SettingName_HowManyDaysToBeNextToExp'
                                    )}
                                </SettingDescription>
                                <InputSetting
                                    keyboardType="numeric"
                                    placeholder="Quantidade de dias"
                                    value={daysToBeNext}
                                    onChangeText={v => {
                                        const regex = /^[0-9\b]+$/;

                                        if (v === '' || regex.test(v)) {
                                            setDaysToBeNext(v);
                                        }
                                    }}
                                />
                                <Notifications />
                            </CategoryOptions>
                        </Category>

                        <Appearance />

                        <Account />
                    </SettingsContent>
                </ScrollView>
            </Container>
        </>
    );
};

export default Settings;
