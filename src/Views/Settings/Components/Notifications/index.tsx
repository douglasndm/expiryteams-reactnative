import React, { useState, useCallback, useContext, useMemo } from 'react';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    NotificationCadency,
    setNotificationCadency,
} from '~/Functions/Settings';

import { Picker } from '../../styles';

import {
    SettingNotificationContainer,
    SettingNotificationDescription,
} from './styles';

interface INotificationCadencyItem {
    label: string;
    value: string;
    key?: string;
}

const Notifications: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);
    const [selectedItem, setSelectedItem] = useState<string>(
        () => userPreferences.notificationCadency
    );

    const data = useMemo(() => {
        const availableCadency: Array<INotificationCadencyItem> = [];
        // if (userPreferences.isUserPremium) {
        //     availableCadency.push({
        //         label: translate('View_Settings_Notifications_Cadency_Hour'),
        //         value: NotificationCadency.Hour,
        //     });
        // }

        availableCadency.push({
            label: translate('View_Settings_Notifications_Cadency_Day'),
            value: NotificationCadency.Day,
            key: NotificationCadency.Day,
        });
        availableCadency.push({
            label: translate('View_Settings_Notifications_Cadency_Never'),
            value: NotificationCadency.Never,
            key: NotificationCadency.Never,
        });

        // if (userPreferences.isUserPremium) {
        //     availableCadency.push({
        //         label: translate('View_Settings_Notifications_Cadency_Week'),
        //         value: NotificationCadency.Week,
        //     });
        //     availableCadency.push({
        //         label: translate('View_Settings_Notifications_Cadency_Month'),
        //         value: NotificationCadency.Month,
        //     });
        // }

        return availableCadency;
    }, []);

    const onValueChange = useCallback(
        async (value) => {
            if (value !== selectedItem && value !== 'null') {
                await setNotificationCadency(value);

                setSelectedItem(value);
            }
        },
        [selectedItem]
    );

    return (
        <SettingNotificationContainer>
            <SettingNotificationDescription>
                {translate('View_Settings_Notifications_Title')}
            </SettingNotificationDescription>

            <Picker
                items={data}
                onValueChange={onValueChange}
                value={selectedItem}
                placeholder={{ label: 'Selecione um item', value: 'null' }}
            />
        </SettingNotificationContainer>
    );
};

export default Notifications;
