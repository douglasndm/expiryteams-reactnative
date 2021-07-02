import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.ScrollView.attrs(() => ({
    contentContainerStyle: { flexGrow: 1 },
}))`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    margin-top: 15px;
    flex: 1;
`;

export const InputGroupTitle = styled.Text`
    font-family: 'Open Sans';
    font-size: 18px;
    text-align: right;
    margin: 5px 15px 5px;
    color: ${({ theme }) => theme.colors.subText};
`;

export const InputGroup = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px 10px;
`;

export const InputTextTip = styled.Text`
    color: red;
    margin: -5px 10px 5px;
`;

export const ActionButton = styled(Button).attrs(props => ({
    color: props.theme.colors.accent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const DeleteAccountContainer = styled.View`
    margin: 15px 0;
`;

export const DeleteAccountText = styled.Text`
    color: red;
`;
