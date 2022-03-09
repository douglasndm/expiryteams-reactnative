import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export const LoadingIndicator = styled.ActivityIndicator.attrs(props => ({
    size: 32,
    color: props.theme.colors.accent,
}))`
    margin-top: 15px;
`;

export const OptionContainer = styled.View`
    margin-top: 25px;
`;

export const ButtonPaper = styled(Button).attrs(() => ({
    color: 'red',
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const CheckBox = styled(BouncyCheckbox).attrs(props => ({
    fillColor: props.theme.colors.accent,
    iconStyle: { borderColor: props.theme.colors.subText },
    textStyle: {
        textDecorationLine: 'none',
        color: props.theme.colors.subText,
    },
}))``;
