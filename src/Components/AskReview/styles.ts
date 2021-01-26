import styled from 'styled-components/native';
import {
    Dialog as DialogPaper,
    Button as ButtonPaper,
} from 'react-native-paper';

export const Dialog = styled(DialogPaper)`
    background-color: ${(props) => props.theme.colors.background};
`;

export const DialogTitle = styled(DialogPaper.Title)`
    color: ${(props) => props.theme.colors.text};
`;

export const DialogText = styled.Text`
    color: ${(props) => props.theme.colors.text};
`;

export const Button = styled(ButtonPaper).attrs((props) => ({
    color: props.theme.colors.accent,
}))``;
