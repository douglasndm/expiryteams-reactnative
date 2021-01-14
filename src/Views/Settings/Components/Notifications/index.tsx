import React, { useState, useCallback, useContext, useMemo } from 'react';

import PreferencesContext from '../../../../Contexts/PreferencesContext';

import { translate } from '../../../../Locales';

import {
    NotificationCadency,
    setNotificationCadency,
} from '../../../../Functions/Settings';

import {
    SettingNotificationContainer,
    SettingNotificationDescription,
    Picker,
} from './styles';

interface INotificationCadencyItem {
    label: string;
    value: string;
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
        });
        availableCadency.push({
            label: translate('View_Settings_Notifications_Cadency_Never'),
            value: NotificationCadency.Never,
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

    const onItemChange = useCallback(async (value) => {
        await setNotificationCadency(value);

        setSelectedItem(value);
    }, []);

    return (
        <SettingNotificationContainer>
            <SettingNotificationDescription>
                {translate('View_Settings_Notifications_Title')}
            </SettingNotificationDescription>

            <Picker
                selectedValue={selectedItem}
                onValueChange={onItemChange}
                mode="dropdown"
            >
                {data.map((item) => (
                    <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </Picker>
        </SettingNotificationContainer>
    );
};

export default Notifications;
