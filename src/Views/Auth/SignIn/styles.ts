import styled from 'styled-components/native';
import { AppleButton as ApplButton } from 'AppleAuth';
import { GoogleSigninButton } from '@react-native-community/google-signin';

export const Container = styled.ScrollView`
    background: ${(props) => props.theme.colors.background};
`;

export const TextsContainer = styled.View`
    padding: 15px;
`;

export const FirstText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold;
`;

export const SecondText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    margin-bottom: 10px;
`;

export const ThirdText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
`;
export const LoginText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
`;
export const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    margin: 10px;
`;

export const AppleButton = styled(ApplButton).attrs(() => ({
    cornerRadius: 5,
    buttonType: ApplButton.Type.CONTINUE,
}))`
    width: 200px;
    height: 60px;
`;

export const GoogleButton = styled(GoogleSigninButton)`
    width: 200px;
    height: 60px;
`;

export const ErrorMessage = styled.Text`
    margin: 10px;
    color: red;
`;
