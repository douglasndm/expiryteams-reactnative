import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;

export const CategoryTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin: 5px 10px;
    color: ${(props) => props.theme.colors.text};
`;

export const ActionsButtonContainer = styled.View`
    flex-direction: row;
    margin-bottom: 15px;
`;

export const ActionButton = styled(Button).attrs((props) => ({
    color: props.theme.colors.accent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;
