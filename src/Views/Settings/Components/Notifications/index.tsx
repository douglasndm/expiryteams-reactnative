import React, { useState, useCallback, useEffect } from 'react';

import { showMessage } from 'react-native-flash-message';
import strings from '~/Locales';

import {
    getNotificationsPreferences,
    updateNotificationsPreferences,
} from '~/Functions/Settings/Notifications';

import {
    SettingNotificationContainer,
    SettingNotificationDescription,
    CheckBox,
    Loading,
} from './styles';

interface INotificationCadencyItem {
    label: string;
    value: string;
    key?: string;
}

const Notifications: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [emailNotification, setEmailNotification] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getNotificationsPreferences();

            setEmailNotification(response.email_enabled);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateSettings = useCallback(async (value: boolean) => {
        try {
            setIsLoading(true);

            await updateNotificationsPreferences({
                email_enabled: value,
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onEmailChange = useCallback(() => {
        updateSettings(!emailNotification);
        setEmailNotification(!emailNotification);
    }, [emailNotification, updateSettings]);

    return isLoading ? (
        <Loading />
    ) : (
        <SettingNotificationContainer>
            <SettingNotificationDescription>
                Notificações por e-mail
            </SettingNotificationDescription>

            <CheckBox
                isChecked={emailNotification}
                onPress={onEmailChange}
                disableBuiltInState
                bounceFriction={10}
                text="Receber resumo semanal"
            />
        </SettingNotificationContainer>
    );
};

export default Notifications;
