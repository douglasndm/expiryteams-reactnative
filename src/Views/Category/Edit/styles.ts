import styled, { css } from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    margin: 10px;
`;
export const PageTitleContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

interface InputTextContainerProps {
    hasError?: boolean;
}

export const InputTextContainer = styled.View<InputTextContainerProps>`
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
    margin: 10px 0;

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

export const InputTextTip = styled.Text`
    color: red;
    margin: 5px 10px 5px;
`;
