import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LogoImg from '~/Assets/Logo.png';

export const Container = styled.ScrollView.attrs(() => ({
    contentContainerStyle: { flexGrow: 1 },
}))`
    flex: 1;
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
    flex-direction: row;
    align-items: center;
`;

export const InputText = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    margin: 5px 0;
    color: ${props => props.theme.colors.text};
    flex: 1
        ${Platform.OS === 'ios' &&
        css`
            padding: 15px 0;
        `};
`;

export const ForgotPasswordText = styled.Text`
    font-family: 'Open Sans';
    font-size: 13px;
    margin-left: 10px;
    color: ${props => props.theme.colors.subText};
`;

export const Icon = styled(Ionicons).attrs(props => ({
    size: 28,
    color: props.theme.colors.subText,
}))``;
