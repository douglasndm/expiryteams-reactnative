import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import CurrencyInput from 'react-native-currency-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.SafeAreaView`
    flex: 1;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
    margin-top: ${Platform.OS === 'ios' ? 0 : 15}px;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

export const PageContent = styled.View`
    padding: 0 16px 16px 16px;
`;

export const InputContainer = styled.View`
    margin-top: 25px;
`;

export const InputGroup = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 10px 0;
`;

interface InputTextContainerProps {
    hasError?: boolean;
}

export const InputTextContainer = styled.View<InputTextContainerProps>`
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};

    ${props =>
        props.hasError &&
        css`
            border: 2px solid red;
        `}
`;

export const InputText = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    padding: 15px 5px 15px 15px;
    font-size: 18px;
    color: ${props => props.theme.colors.text};
`;

export const InputTextTip = styled.Text`
    color: red;
    margin: -5px 10px 5px;
`;

export const Currency = styled(CurrencyInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
`;

export const InputCodeTextContainer = styled.View<InputTextContainerProps>`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    padding-right: 10px;

    ${props =>
        props.hasError &&
        css`
            border: 2px solid red;
        `}
`;

export const InputTextIconContainer = styled(RectButton)``;

export const InputCodeTextIcon = styled(Ionicons).attrs(props => ({
    name: 'barcode-outline',
    size: 36,
    color: props.theme.colors.text,
}))``;

export const InputCodeText = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    flex: 1;
    padding: 15px 5px 15px 15px;
    font-size: 18px;
    color: ${props => props.theme.colors.text};
`;

export const MoreInformationsContainer = styled.View``;

export const MoreInformationsTitle = styled.Text`
    font-size: 16px;
    text-align: right;
    color: ${({ theme }) => theme.colors.subText};
    margin-bottom: 5px;
`;

export const ExpDateGroup = styled.View`
    align-items: center;
`;
export const ExpDateLabel = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.colors.subText};
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const CustomDatePicker = styled(DatePicker).attrs(props => ({
    textColor: props.theme.colors.inputText,
    fadeToColor: 'none',
    mode: 'date',
}))`
    background: ${({ theme }) => theme.colors.productBackground};
    z-index: 1;
`;
