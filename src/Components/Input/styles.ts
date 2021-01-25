import styled, { css } from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    margin: 10px 5px;
`;

interface InputTextContainerProps {
    hasError?: boolean;
}

export const InputTextContainer = styled.View<InputTextContainerProps>`
    width: 100%;

    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.inputBackground};

    ${(props) =>
        props.hasError &&
        css`
            border: 2px solid red;
        `}
`;

export const InputText = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    padding: 15px 5px 15px 15px;
    font-size: 18px;
    color: ${(props) => props.theme.colors.text};
`;
