import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../Locales';

import StatusBar from '../../Components/StatusBar';
import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

import Appearance from './Appearance';

import {
    setHowManyDaysToBeNextExp,
    setEnableNotifications,
    setEnableMultipleStoresMode,
} from '../../Functions/Settings';
import { ImportBackupFile, ExportBackupFile } from '../../Functions/Backup';
import { exportToExcel } from '../../Functions/Excel';
import { isSubscriptionActive } from '../../Functions/ProMode';
import { isUserSignedIn, signOutGoogle } from '../../Functions/Auth/Google';

import PreferencesContext from '../../Contexts/PreferencesContext';

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
    PremiumButtonsContainer,
    ButtonPremium,
    ButtonPremiumText,
    ButtonCancel,
    ButtonCancelText,
} from './styles';

const Settings: React.FC = () => {
    const [error, setError] = useState<string>('');

    const [daysToBeNext, setDaysToBeNext] = useState<string>('');
    const [userIsPremium, setUserIsPremium] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );
    const [userSigned, setUserSigned] = useState<boolean>(false);
    const [isOnLogout, setIsOnLogout] = useState<boolean>(false);

    const { navigate, goBack, reset } = useNavigation();

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

    const handleCancel = useCallback(async () => {
        await Linking.openURL(
            'https://play.google.com/store/account/subscriptions?sku=controledevalidade_premium&package=com.controledevalidade'
        );

        if (!(await isSubscriptionActive())) {
            reset({
                routes: [{ name: 'Home' }],
            });
        }
    }, [reset]);

    const handleNotificationEnabledSwitch = useCallback(async () => {
        await setEnableNotifications(!isNotificationsEnabled);

        setIsNotificationsEnabled(!isNotificationsEnabled);
    }, [isNotificationsEnabled]);

    const handleMultiStoresEnableSwitch = useCallback(async () => {
        await setEnableMultipleStoresMode(!multipleStoresState);

        setUserPreferences({
            ...userPreferences,
            multiplesStores: !userPreferences.multiplesStores,
        });
    }, [multipleStoresState, setUserPreferences, userPreferences]);

    const loadData = useCallback(async () => {
        const isSigned = await isUserSignedIn();
        setUserSigned(isSigned);
    }, []);

    useEffect(() => {
        setDaysToBeNext(String(userPreferences.howManyDaysToBeNextToExpire));
        setUserIsPremium(userPreferences.isUserPremium);
        setMultipleStoresState(userPreferences.multiplesStores);
        setIsNotificationsEnabled(userPreferences.enableNotifications);

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

    const navigateToPremiumView = useCallback(() => {
        navigate('PremiumSubscription');
    }, [navigate]);

    const handleImportBackup = useCallback(async () => {
        await ImportBackupFile();
    }, []);

    const handleExportBackup = useCallback(async () => {
        await ExportBackupFile();
    }, []);

    const handleExportToExcel = useCallback(async () => {
        await exportToExcel();
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            setIsOnLogout(true);
            await signOutGoogle();

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

    return (
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
                            {translate('View_Settings_CategoryName_General')}
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
                                onChangeText={(v) => {
                                    const regex = /^[0-9\b]+$/;

                                    if (v === '' || regex.test(v)) {
                                        setDaysToBeNext(v);
                                    }
                                }}
                            />

                            <SettingContainer>
                                <SettingDescription>
                                    {translate(
                                        'View_Settings_SettingName_EnableNotification'
                                    )}
                                </SettingDescription>
                                <Switch
                                    value={isNotificationsEnabled}
                                    onValueChange={
                                        handleNotificationEnabledSwitch
                                    }
                                />
                            </SettingContainer>

                            <SettingContainer>
                                <SettingDescription>
                                    {translate(
                                        'View_Settings_SettingName_EnableMultiplesStores'
                                    )}
                                </SettingDescription>
                                <Switch
                                    value={userPreferences.multiplesStores}
                                    onValueChange={
                                        handleMultiStoresEnableSwitch
                                    }
                                />
                            </SettingContainer>
                        </CategoryOptions>

                        <Appearance />
                    </Category>

                    <Category>
                        <CategoryTitle>
                            {translate('View_Settings_CategoryName_Pro')}
                        </CategoryTitle>

                        {!userIsPremium && (
                            <GenericButton
                                text={translate(
                                    'View_Settings_Button_BecobeProToUnlockNewFeatures'
                                )}
                                onPress={navigateToPremiumView}
                            />
                        )}

                        <CategoryOptions notPremium={!userIsPremium}>
                            <View>
                                <SettingDescription>
                                    {translate(
                                        'View_Settings_SettingName_ExportAndInmport'
                                    )}
                                </SettingDescription>

                                <PremiumButtonsContainer>
                                    <ButtonPremium
                                        disabled={!userIsPremium}
                                        onPress={handleImportBackup}
                                    >
                                        <ButtonPremiumText>
                                            {translate(
                                                'View_Settings_Button_ImportFile'
                                            )}
                                        </ButtonPremiumText>
                                    </ButtonPremium>
                                    <ButtonPremium
                                        disabled={!userIsPremium}
                                        onPress={handleExportBackup}
                                    >
                                        <ButtonPremiumText>
                                            {translate(
                                                'View_Settings_Button_ExportFile'
                                            )}
                                        </ButtonPremiumText>
                                    </ButtonPremium>

                                    <ButtonPremium
                                        disabled={!userIsPremium}
                                        onPress={handleExportToExcel}
                                    >
                                        <ButtonPremiumText>
                                            {translate(
                                                'View_Settings_Button_ExportToExcel'
                                            )}
                                        </ButtonPremiumText>
                                    </ButtonPremium>
                                </PremiumButtonsContainer>
                            </View>
                        </CategoryOptions>

                        {userIsPremium && (
                            <ButtonCancel onPress={handleCancel}>
                                <ButtonCancelText>
                                    {translate(
                                        'View_Settings_Button_CancelSubscribe'
                                    )}
                                </ButtonCancelText>
                            </ButtonCancel>
                        )}
                    </Category>

                    {userSigned && (
                        <Category>
                            <CategoryTitle>
                                {translate(
                                    'View_Settings_CategoryName_Account'
                                )}
                            </CategoryTitle>

                            <SettingDescription>
                                {translate('View_Settings_AccountDescription')}
                            </SettingDescription>

                            <GenericButton
                                text={translate('View_Settings_Button_SignOut')}
                                onPress={handleLogout}
                                isLoading={isOnLogout}
                            />
                        </Category>
                    )}
                </SettingsContent>
            </ScrollView>
        </Container>
    );
};

export default Settings;
