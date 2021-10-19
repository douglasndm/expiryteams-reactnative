import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';

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
        height: 180px;
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
        width: 120px;
        height: 120px;
    `};
`;

export const LogoTitle = styled.Text`
    font-size: 26px;
    font-family: 'Open Sans';
    font-weight: bold;
    color: #fff;
`;

export const FormContainer = styled.View`
    align-items: stretch;
    margin-top: 14px;
    padding: 0 15px;
`;

export const FormTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    margin-bottom: 15px;
    font-size: 26px;
    text-align: center;
`;

export const LoginForm = styled.View`
    flex-direction: column;
    flex: 1;
`;

export const ForgotPasswordText = styled.Text`
    font-family: 'Open Sans';
    font-size: 15px;
    margin: 5px 10px 0;
    color: ${props => props.theme.colors.subText};
`;
