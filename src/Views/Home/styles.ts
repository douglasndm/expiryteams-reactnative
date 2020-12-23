import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;

export const InputTextContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: 10px 10px 0 10px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    padding-right: 10px;
`;

export const InputTextIconContainer = styled(RectButton)``;

export const InputTextIcon = styled(Ionicons).attrs((props) => ({
    name: 'barcode-outline',
    size: 36,
    color: props.theme.colors.text,
}))``;

export const InputSearch = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    color: ${(props) => props.theme.colors.inputText};
    flex: 1;
    padding: 12px;
    font-size: 16px;
`;
