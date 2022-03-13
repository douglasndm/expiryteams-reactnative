import styled from 'styled-components/native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { css } from 'styled-components';

export const PageTitleContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    ${isIphoneX() &&
    css`
        margin-top: 35px;
    `}
`;

export const ButtonPaper = styled(Button).attrs(props => ({
    color: props.theme.colors.textAccent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const ActionsButtonContainer = styled.View`
    flex-direction: column;
    align-items: flex-start;
    margin-top: 5px;
`;
