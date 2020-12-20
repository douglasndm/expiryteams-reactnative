import React from 'react';

import { translate } from '../../Locales';

import { Container, Title, Description } from './styles';

interface NotificationProps {
    NotificationMessage: string;
    NotificationType?: 'normal' | 'error';
    onPress: () => void;
}

const Notification: React.FC<NotificationProps> = ({
    NotificationMessage,
    NotificationType = 'normal',
    onPress,
}: NotificationProps) => {
    return (
        <Container NotificationType={NotificationType} onPress={onPress}>
            <Title>
                {NotificationType === 'error'
                    ? translate('NotificationComponent_NotificationTypeError')
                    : translate('NotificationComponent_NotificationTypeSimple')}
                | {translate('NotificationComponent_NotificationCloseText')}
            </Title>
            <Description>{NotificationMessage}</Description>
        </Container>
    );
};

export default Notification;
