import React, { useState, useCallback, useContext, useMemo } from 'react';

import PreferencesContext from '../../../../Contexts/PreferencesContext';

import { translate } from '../../../../Locales';

import {
    NotificationCadency,
    setNotificationCadency,
} from '../../../../Functions/Settings';

import { Dropdown } from '../../styles';
import {
    SettingNotificationContainer,
    SettingNotificationDescription,
} from './styles';

interface INotificationCadencyItem {
    label: string;
    value: string;
}

const Notifications: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [data, setData] = useState<Array<INotificationCadencyItem>>([
        // {
        //     label: translate(
        //         'View_Settings_Notifications_Cadency_Hour'
        //     ),
        //     value: NotificationCadency.Hour,
        // },
        {
            label: translate('View_Settings_Notifications_Cadency_Day'),
            value: NotificationCadency.Day,
        },
        // {
        //     label: translate(
        //         'View_Settings_Notifications_Cadency_Week'
        //     ),
        //     value: NotificationCadency.Week,
        // },
        // {
        //     label: translate(
        //         'View_Settings_Notifications_Cadency_Month'
        //     ),
        //     value: NotificationCadency.Month,
        // },
        {
            label: translate('View_Settings_Notifications_Cadency_Never'),
            value: NotificationCadency.Never,
        },
    ]);

    const onItemChange = useCallback(async ({ value }) => {
        await setNotificationCadency(value);
    }, []);

    const cadency = useMemo(() => {
        const find = data.find(
            (d) => d.value === userPreferences.notificationCadency
        );

        if (find) {
            return userPreferences.notificationCadency;
        }

        return NotificationCadency.Day;
    }, [userPreferences.notificationCadency, data]);

    return (
        <SettingNotificationContainer>
            <SettingNotificationDescription>
                {translate('View_Settings_Notifications_Title')}
            </SettingNotificationDescription>
            <Dropdown
                items={data}
                defaultValue={cadency}
                onChangeItem={onItemChange}
            />
        </SettingNotificationContainer>
    );
};

export default Notifications;
