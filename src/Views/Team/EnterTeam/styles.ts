import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    padding: ${Platform.OS === 'ios' ? 50 : 16}px 10px 5px 10px;
    background-color: ${props => props.theme.colors.background};
`;

export const InviteText = styled.Text`
    font-family: 'Open Sans';
    margin-left: 10px;
    margin-top: 25px;
`;

export const InputTextTip = styled.Text`
    color: red;
    margin: 5px 10px 0px;
`;

export const CodeContaider = styled.View``;

export const InputContainer = styled.View`
    margin: 10px 5px;
`;

interface InputTextContainerProps {
    hasError?: boolean;
}

export const InputTextContainer = styled.View<InputTextContainerProps>`
    margin-right: 7px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.inputBackground};

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
