import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';

export const HeaderContainer = styled.View`
    width: 100%;
    padding: 30px 30px 15px 0px;

    justify-content: flex-start;
    align-items: center;

    background-color: ${(props) => props.theme.colors.accent};

    flex-direction: row;

    ${isIphoneX() &&
    css`
        padding-top: ${getStatusBarHeight() + 20}px;
    `}
    ${Platform.OS === 'android' &&
    css`
        padding-top: 20px;
    `}
`;

export const TextLogo = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: white;
`;

export const MenuButton = styled(RectButton)`
    margin: 0 10px;
`;

export const MenuIcon = styled(Ionicons).attrs({
    name: 'menu-outline',
    size: 33,
    color: 'white',
})``;
