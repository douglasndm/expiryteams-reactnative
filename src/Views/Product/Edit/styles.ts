import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProductStatus {
    expired?: boolean;
    nextToExp?: boolean;
    expiredOrNext?: boolean;
}

export const PageTitleContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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
