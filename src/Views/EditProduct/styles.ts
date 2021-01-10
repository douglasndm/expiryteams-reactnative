import styled, { css } from 'styled-components/native';
import { Button, Dialog } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProductStatus {
    expired?: boolean;
    nextToExp?: boolean;
    expiredOrNext?: boolean;
}

export const ButtonPaper = styled(Button).attrs((props) => ({
    color: props.theme.colors.textAccent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const ActionsButtonContainer = styled.View`
    flex-direction: row;
    justify-content: center;
`;

export const Text = styled.Text<IProductStatus>`
    color: ${(props) => props.theme.colors.text};

    ${(props) =>
        props.expiredOrNext &&
        css`
            color: white;
        `}
`;

export const DialogPaper = styled(Dialog)`
    background: ${(props) => props.theme.colors.productBackground};
`;
