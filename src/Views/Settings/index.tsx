import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

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

import { migrateAllDataFromSQLiteToRealm } from '../../typeorm/MigrateTypeormData';

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
    const [daysToBeNext, setDaysToBeNext] = useState<string>('');
    const [userIsPremium, setUserIsPremium] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );
    const [userSigned, setUserSigned] = useState<boolean>(false);

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

    const migrateData = useCallback(async () => {
        await migrateAllDataFromSQLiteToRealm();
    }, []);

    const handleLogout = useCallback(async () => {
        await signOutGoogle();
    }, []);

    return (
        <Container>
            <ScrollView>
                <PageHeader>
                    <BackButton handleOnPress={goBack} />

                    <PageTitle>Configurações</PageTitle>
                </PageHeader>

                <SettingsContent>
                    <Category>
                        <CategoryTitle>Geral</CategoryTitle>

                        <CategoryOptions>
                            <SettingDescription>
                                Quantos dias para produto ser considerado
                                próximo
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
                                    Notificações habilitadas?
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
                                    Habilitar modo de múltiplas lojas
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
                        <CategoryTitle>Premium</CategoryTitle>

                        {!userIsPremium && (
                            <GenericButton
                                text="SEJA PREMIUM E DESBLOQUEIE MAIS FUNÇÕES"
                                onPress={navigateToPremiumView}
                            />
                        )}

                        <CategoryOptions notPremium={!userIsPremium}>
                            <View>
                                <SettingDescription>
                                    Com a função de importar e exportar você
                                    consegue salvar todos os seus produtos
                                    externamente em um cartão de memória por
                                    exemplo e depois importar em outro telefone
                                    ou depois de formatar este.
                                </SettingDescription>

                                <PremiumButtonsContainer>
                                    <ButtonPremium
                                        disabled={!userIsPremium}
                                        onPress={handleImportBackup}
                                    >
                                        <ButtonPremiumText>
                                            Importar
                                        </ButtonPremiumText>
                                    </ButtonPremium>
                                    <ButtonPremium
                                        disabled={!userIsPremium}
                                        onPress={handleExportBackup}
                                    >
                                        <ButtonPremiumText>
                                            Exportar
                                        </ButtonPremiumText>
                                    </ButtonPremium>

                                    <ButtonPremium
                                        disabled={!userIsPremium}
                                        onPress={handleExportToExcel}
                                    >
                                        <ButtonPremiumText>
                                            Exportar para Excel (EM TESTES)
                                        </ButtonPremiumText>
                                    </ButtonPremium>
                                </PremiumButtonsContainer>
                            </View>
                        </CategoryOptions>

                        {userIsPremium && (
                            <ButtonCancel onPress={handleCancel}>
                                <ButtonCancelText>
                                    Cancelar assinatura
                                </ButtonCancelText>
                            </ButtonCancel>
                        )}
                    </Category>

                    <Category>
                        <CategoryTitle>Banco de dados de testes</CategoryTitle>

                        <SettingDescription>
                            Se você atualizou o aplicativo recentemente e não
                            consegue ver seus dados utilize este botão para
                            copiar todos os dados antigos para a nova
                            atualização
                        </SettingDescription>

                        <GenericButton
                            text="Migrar dados"
                            onPress={migrateData}
                        />
                    </Category>

                    {userSigned && (
                        <Category>
                            <CategoryTitle>Conta</CategoryTitle>

                            <SettingDescription>
                                Gerencie sua conta vinculada ao aplicativo.
                            </SettingDescription>

                            <GenericButton
                                text="Sair da conta"
                                onPress={handleLogout}
                            />
                        </Category>
                    )}
                </SettingsContent>
            </ScrollView>
        </Container>
    );
};

export default Settings;
