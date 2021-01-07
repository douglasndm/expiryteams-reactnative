import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled(RectButton)`
    flex-direction: row;
    padding: 10px;
`;

export const TextContainer = styled.View``;

export const UserName = styled.Text`
    margin-left: 10px;
    font-size: 16px;
    color: ${(props) => props.theme.colors.text};
`;

export const UserEmail = styled.Text`
    margin: 0 10px;
    font-size: 11px;
    color: ${(props) => props.theme.colors.text};
`;

export const UserLabel = styled.Text`
    margin-left: 10px;
    font-size: 12px;
    color: ${(props) => props.theme.colors.text};
`;

export const UserPhoto = styled(Image)`
    width: 54px;
    height: 54px;
    border-radius: 26px;
`;

export const DefaultUserPhoto = styled(Ionicons).attrs((props) => ({
    size: 42,
    name: 'person-circle-outline',
    color: props.theme.colors.text,
}))``;

export const LoginContainer = styled.View`
    flex: 1;
    justify-content: center;
    margin: 0 10px;
`;

export const LoginText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 15px;
`;
