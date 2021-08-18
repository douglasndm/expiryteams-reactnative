import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export const SettingNotificationContainer = styled.View`
    flex-direction: column;
    margin-top: 15px;
`;

export const SettingNotificationDescription = styled.Text`
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    margin-bottom: 10px;
`;

export const CheckBox = styled(BouncyCheckbox).attrs(props => ({
    fillColor: props.theme.colors.accent,
    iconStyle: { borderColor: props.theme.colors.subText },
    textStyle: {
        textDecorationLine: 'none',
        color: props.theme.colors.subText,
    },
}))``;

export const Loading = styled(ActivityIndicator).attrs(() => ({
    size: 48,
    color: '#fff',
}))`
    margin-top: 15px;
`;
