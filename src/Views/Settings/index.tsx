import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';
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
    const [userSigned, setUserSigned] = useState<boolean>(false);
    const [isOnLogout, setIsOnLogout] = useState<boolean>(false);

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

    const loadData = useCallback(async () => {
        const isSigned = await isUserSignedIn();
        setUserSigned(isSigned);
    }, []);

    useEffect(() => {
        setDaysToBeNext(String(userPreferences.howManyDaysToBeNextToExpire));

        loadData();
    }, [userPreferences, loadData]);

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

    const handleLogout = useCallback(async () => {
        try {
            setIsOnLogout(true);
            await signOut();

            setUserPreferences({
                ...userPreferences,
                isUserSignedIn: false,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsOnLogout(false);
        }
    }, [setUserPreferences, userPreferences]);

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

                        {userSigned && (
                            <Category>
                                <CategoryTitle>
                                    {translate(
                                        'View_Settings_CategoryName_Account'
                                    )}
                                </CategoryTitle>

                                <SettingDescription>
                                    {translate(
                                        'View_Settings_AccountDescription'
                                    )}
                                </SettingDescription>

                                <GenericButton
                                    text={translate(
                                        'View_Settings_Button_SignOut'
                                    )}
                                    onPress={handleLogout}
                                    isLoading={isOnLogout}
                                />
                            </Category>
                        )}
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
