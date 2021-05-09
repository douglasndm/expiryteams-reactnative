import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.background};
`;

export const FormTitle = styled.Text`
    margin-bottom: 15px;
    font-size: 26px;
    text-align: left;
`;

export const LoginForm = styled.View`
    flex-direction: column;
`;

export const InputContainer = styled.View`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 10px 15px;
    width: 350px;
    margin-bottom: 10px;
    border-radius: 12px;
`;

export const InputText = styled.TextInput`
    margin: 5px 0;
`;
