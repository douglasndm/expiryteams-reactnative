import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import NotificationError from '~/Components/Notification';

import Appearance from './Components/Appearance';
import Notifications from './Components/Notifications';

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
    const [error, setError] = useState<string>('');

    const [daysToBeNext, setDaysToBeNext] = useState<string>('');

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const { goBack } = useNavigation();

    const setSettingDaysToBeNext = useCallback(
        async (days: number) => {
            await setHowManyDaysToBeNextExp(days);

            setUserPreferences({
                ...userPreferences,
                howManyDaysToBeNextToExpire: days,
            });
        },
        [setUserPreferences, userPreferences]
    );

    useEffect(() => {
        setDaysToBeNext(String(userPreferences.howManyDaysToBeNextToExpire));
    }, [userPreferences]);

    useEffect(() => {
        async function SetNewDays() {
            const previousDaysToBeNext = String(
                userPreferences.howManyDaysToBeNextToExpire
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
        userPreferences.howManyDaysToBeNextToExpire,
    ]);

    const onDimissError = useCallback(() => {
        setError('');
    }, []);

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
                    </SettingsContent>
                </ScrollView>
            </Container>
            {!!error && (
                <NotificationError
                    NotificationType="error"
                    NotificationMessage={error}
                    onPress={onDimissError}
                />
            )}
        </>
    );
};

export default Settings;
