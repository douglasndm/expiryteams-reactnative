import styled from 'styled-components/native';
import { Picker as ReactPicker } from '@react-native-picker/picker';

export const Container = styled.View``;

export const SettingNotificationContainer = styled.View`
    flex-direction: column;
    margin-top: 15px;
`;

export const SettingNotificationDescription = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 10px;
`;

export const Picker = styled(ReactPicker).attrs((props) => ({
    itemStyle: {
        color: props.theme.colors.text,
    },
}))`
    color: ${(props) => props.theme.colors.text};
`;
