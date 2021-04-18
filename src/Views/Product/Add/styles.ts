import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import CurrencyInput from 'react-native-currency-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

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

export const CameraButtonContainer = styled(RectButton)`
    margin-left: 15px;
`;

export const CameraButtonIcon = styled(Ionicons).attrs(props => ({
    name: 'camera-outline',
    size: 36,
    color: props.theme.colors.text,
}))``;

export const ProductImageContainer = styled(RectButton)`
    align-items: center;
    margin-top: 10px;
`;

export const ProductImage = styled.Image`
    margin-top: 15px;
    border-radius: 75px;

    width: 150px;
    height: 150px;
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

export const PickerContainer = styled.View`
    justify-content: space-between;

    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    background-color: ${({ theme }) => theme.colors.inputBackground};

    padding: 5px;
    font-size: 18px;

    ${Platform.OS === 'ios' &&
    css`
        padding: 17px 10px;
    `}
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

export const BannerContainer = styled(RectButton)`
    flex-direction: row;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.accent};
    padding: 15px 10px;
    border-radius: 12px;
    margin-bottom: 15px;
`;

export const BannerText = styled.Text`
    font-size: 18px;
    font-weight: bold;

    color: #fff;
`;

export const Icons = styled(Ionicons).attrs(() => ({
    size: 22,
    color: '#fff',
}))``;
