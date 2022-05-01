import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { Platform, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Switch } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';
import { useTeam } from '~/Contexts/TeamContext';

import StatusBar from '~/Components/StatusBar';
import Header from '~/Components/Header';

import Appearance from './Components/Appearance';
import Notifications from './Components/Notifications';
import Account from './Components/Account';

import {
    setHowManyDaysToBeNextExp,
    setAutoComplete,
} from '~/Functions/Settings';

import {
    Container,
    SettingsContent,
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingDescription,
    InputSetting,
    ButtonCancel,
    ButtonCancelText,
    SettingContainer,
} from './styles';

const Settings: React.FC = () => {
    const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

    const { preferences, setPreferences } = useContext(PreferencesContext);
    const teamContext = useTeam();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [daysToBeNext, setDaysToBeNext] = useState<string>('');
    const [autoCompleteState, setAutoCompleteState] = useState<boolean>(false);

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

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const previousDaysToBeNext = String(
                preferences.howManyDaysToBeNextToExpire
            );

            if (!daysToBeNext || daysToBeNext === '') {
                return;
            }

            if (!!daysToBeNext && previousDaysToBeNext !== daysToBeNext) {
                await setSettingDaysToBeNext(Number(daysToBeNext));
            }

            setAutoCompleteState(preferences.autoComplete);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [
        daysToBeNext,
        preferences.autoComplete,
        preferences.howManyDaysToBeNextToExpire,
        setSettingDaysToBeNext,
    ]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleUpdateAutoComplete = useCallback(async () => {
        const newValue = !autoCompleteState;
        setAutoCompleteState(newValue);

        await setAutoComplete(newValue);

        setPreferences({
            ...preferences,
            autoComplete: newValue,
        });
    }, [autoCompleteState, preferences, setPreferences]);

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

    const cancelSubscriptionLink = useMemo(() => {
        return Platform.OS === 'ios'
            ? 'https://apps.apple.com/account/subscriptions'
            : 'https://play.google.com/store/account/subscriptions?sku=expirybusiness_monthly_default_1person&package=dev.douglasndm.expirychecker.business';
    }, []);

    const handleNavigateCancel = useCallback(async () => {
        await Linking.openURL(cancelSubscriptionLink);

        reset({
            routes: [{ name: 'Home' }],
        });
    }, [cancelSubscriptionLink, reset]);

    return (
        <Container>
            <StatusBar />
            <Header title={strings.View_Settings_PageTitle} noDrawer />

            <SettingsContent>
                <Category>
                    <CategoryTitle>
                        {strings.View_Settings_CategoryName_General}
                    </CategoryTitle>

                    <CategoryOptions>
                        <SettingDescription>
                            {
                                strings.View_Settings_SettingName_HowManyDaysToBeNextToExp
                            }
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

                        <SettingContainer>
                            <SettingDescription>
                                Autocompletar automacatimente
                            </SettingDescription>
                            <Switch
                                value={autoCompleteState}
                                onValueChange={handleUpdateAutoComplete}
                            />
                        </SettingContainer>

                        <Notifications />
                    </CategoryOptions>
                </Category>

                <Appearance />

                <Account />

                {teamContext.roleInTeam?.role.toLowerCase() === 'manager' && (
                    <ButtonCancel onPress={handleNavigateCancel}>
                        <ButtonCancelText>Cancelar assinatura</ButtonCancelText>
                    </ButtonCancel>
                )}
            </SettingsContent>
        </Container>
    );
};

export default Settings;
