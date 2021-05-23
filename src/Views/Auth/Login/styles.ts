import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';

import LogoImg from '~/Assets/Logo.png';

export const Container = styled.View`
    flex: 1;
    justify-content: space-between;
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    flex: 1;
    align-items: stretch;
`;

export const LogoContainer = styled.View`
    height: 300px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.accent};

    ${Platform.OS === 'android' &&
    css`
        height: 220px;
    `};
`;

export const Logo = styled.Image.attrs(() => ({
    source: LogoImg,
}))`
    margin-top: 25px;
    width: 150px;
    height: 150px;

    ${Platform.OS === 'android' &&
    css`
        margin-top: 0;
    `};
`;

export const LogoTitle = styled.Text`
    font-size: 26px;
    font-family: 'Open Sans';
    font-weight: bold;
    color: #fff;
`;

export const FormContainer = styled.View`
    align-items: center;
    margin-top: 14px;
`;

export const FormTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    margin-bottom: 15px;
    font-size: 26px;
    text-align: left;
`;

export const LoginForm = styled.View`
    flex-direction: column;
`;

export const InputContainer = styled.View`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 0 15px;
    width: 350px;
    margin-bottom: 10px;
    border-radius: 12px;
`;

export const InputText = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    margin: 5px 0;
    color: ${props => props.theme.colors.text};

    ${Platform.OS === 'ios' &&
    css`
        padding: 15px 0;
    `}
`;

export const Text = styled.Text`
    color: ${props => props.theme.colors.text};
    text-align: center;
`;

export const ForgotPasswordText = styled.Text`
    font-family: 'Open Sans';
    font-size: 13px;
    margin-left: 10px;
    color: ${props => props.theme.colors.subText};
`;

export const CreateAccountText = styled.Text`
    margin-bottom: 15px;
    color: ${props => props.theme.colors.textAccent};
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 15px;
`;

export const AboutContainer = styled.View`
    margin: 30px 15px;
    align-items: center;
`;

export const Link = styled.Text`
    color: ${props => props.theme.colors.accent};
    font-size: 14px;
`;
