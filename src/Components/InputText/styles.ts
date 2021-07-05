import styled, { css } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface InputTextContainerProps {
    hasError?: boolean;
}

export const Container = styled.View<InputTextContainerProps>`
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

export const Content = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Input = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    padding: 15px 5px 15px 15px;
    font-size: 18px;
    color: ${props => props.theme.colors.text};
    flex: 1;
`;

export const Icon = styled(Ionicons).attrs(props => ({
    size: 28,
    color: props.theme.colors.subText,
}))`
    padding-right: 15px;
`;
