import React, { useState, useCallback, useContext, useMemo } from 'react';
import { View, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPermissions from 'react-native-permissions';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { isSubscriptionActive } from '~/Functions/ProMode';
import { importBackupFile } from '~/Functions/Backup';

import Button from '~/Components/Button';
import Notification from '~/Components/Notification';

import {
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingDescription,
} from '../../styles';

import {
    Container,
    PremiumButtonsContainer,
    ButtonPremium,
    ButtonPremiumText,
    ButtonCancel,
    ButtonCancelText,
    Loading,
} from './styles';

const Pro: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [isImportLoading, setIsImportLoading] = useState<boolean>(false);
    const [error, setError] = useState('');

    const { navigate, reset } = useNavigation();

    const cancelSubscriptionLink = useMemo(() => {
        return Platform.OS === 'ios'
            ? 'https://apps.apple.com/account/subscriptions'
            : 'https://play.google.com/store/account/subscriptions?sku=controledevalidade_pro_monthly&package=com.controledevalidade';
    }, []);

    const handleCancel = useCallback(async () => {
        await Linking.openURL(cancelSubscriptionLink);

        if (!(await isSubscriptionActive())) {
            reset({
                routes: [{ name: 'Home' }],
            });
        }
    }, [reset, cancelSubscriptionLink]);

    const navigateToPremiumView = useCallback(() => {
        navigate('Pro');
    }, [navigate]);

    const handleImportBackup = useCallback(async () => {
        try {
            setIsImportLoading(true);

            if (Platform.OS === 'android') {
                const isReadFileAllow = await RNPermissions.check(
                    RNPermissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                );
                if (isReadFileAllow !== 'granted') {
                    const granted = await RNPermissions.request(
                        RNPermissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                    );

                    if (granted !== 'granted') {
                        throw new Error('Permission denided');
                    }
                }
            }

            await importBackupFile();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsImportLoading(false);
        }
    }, []);

    const onDimissError = useCallback(() => {
        setError('');
    }, []);

    return (
        <>
            <Container>
                <Category>
                    <CategoryTitle>
                        {translate('View_Settings_CategoryName_Pro')}
                    </CategoryTitle>

                    {!userPreferences.isUserPremium && (
                        <Button
                            text={translate(
                                'View_Settings_Button_BecobeProToUnlockNewFeatures'
                            )}
                            onPress={navigateToPremiumView}
                        />
                    )}

                    <CategoryOptions
                        notPremium={!userPreferences.isUserPremium}
                    >
                        <View>
                            <SettingDescription>
                                {translate(
                                    'View_Settings_SettingName_ExportAndInmport'
                                )}
                            </SettingDescription>

                            <PremiumButtonsContainer>
                                <ButtonPremium
                                    enabled={
                                        userPreferences.isUserPremium &&
                                        !isImportLoading
                                    }
                                    onPress={handleImportBackup}
                                >
                                    {isImportLoading ? (
                                        <Loading />
                                    ) : (
                                        <ButtonPremiumText>
                                            {translate(
                                                'View_Settings_Button_ImportFile'
                                            )}
                                        </ButtonPremiumText>
                                    )}
                                </ButtonPremium>
                            </PremiumButtonsContainer>
                        </View>
                    </CategoryOptions>

                    {userPreferences.isUserPremium && (
                        <ButtonCancel onPress={handleCancel}>
                            <ButtonCancelText>
                                {translate(
                                    'View_Settings_Button_CancelSubscribe'
                                )}
                            </ButtonCancelText>
                        </ButtonCancel>
                    )}
                </Category>
            </Container>
            {!!error && (
                <Notification
                    NotificationType="error"
                    NotificationMessage={error}
                    onPress={onDimissError}
                />
            )}
        </>
    );
};

export default Pro;
