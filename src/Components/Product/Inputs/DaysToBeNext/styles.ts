import styled from 'styled-components/native';

export const Container = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 10px 0;
`;

export const TextDescription = styled.Text`
    margin: 0 5px 7px;
    font-family: 'Open Sans';
`;

export const InputTextContainer = styled.View`
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
`;

export const InputText = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.placeholderColor,
}))`
    padding: 15px 5px 15px 15px;
    font-size: 18px;
    color: ${props => props.theme.colors.inputText};
`;
