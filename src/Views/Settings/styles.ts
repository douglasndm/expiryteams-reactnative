import styled from 'styled-components/native';
import { Platform } from 'react-native';

import RNPickerSelect from 'react-native-picker-select';

interface Request {
    notPremium?: boolean;
}

export const Container = styled.SafeAreaView`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;
export const PageHeader = styled.View`
    margin-top: ${Platform.OS === 'ios' ? 0 : 15}px;
    flex-direction: row;
    align-items: center;
`;
export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

export const SettingsContent = styled.View`
    padding: 0 16px 16px 16px;
`;

export const Category = styled.View`
    margin-top: 20px;
    padding: 15px 15px 25px;
    background-color: ${(props) => props.theme.colors.productBackground};
    border-radius: 12px;
`;

export const CategoryTitle = styled.Text`
    font-size: 21px;
    color: ${(props) => props.theme.colors.text};
`;

export const CategoryOptions = styled.View<Request>`
    margin-top: 20px;
    opacity: ${(props) => (props.notPremium ? 0.2 : 1)};
`;

export const SettingContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
`;

export const SettingDescription = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.text};
`;

export const InputSetting = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.colors.text,
}))`
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 8px;
    padding: 10px;
    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.text};
`;

export const Picker = styled(RNPickerSelect).attrs(({ theme }) => ({
    pickerProps: {
        style: {
            color: theme.colors.text,
        },
    },
    textInputProps: {
        style: {
            color: theme.colors.text,
        },
    },
}))``;
