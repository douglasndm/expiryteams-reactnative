import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';

export const HeaderContainerNoDrawner = styled.SafeAreaView`
    margin-top: 15px;
    flex-direction: row;
`;

export const HeaderContainer = styled(RectButton)`
    width: 100%;
    padding: 30px 30px 15px 0px;

    justify-content: flex-start;
    align-items: center;

    background-color: ${props => props.theme.colors.accent};

    flex-direction: row;

    ${isIphoneX() &&
    css`
        padding-top: ${getStatusBarHeight() + 20}px;
    `}
    ${Platform.OS === 'android' &&
    css`
        padding-top: 10px;
    `}
`;

interface TextLogoProps {
    noDrawer?: boolean;
}

export const TextLogo = styled.Text<TextLogoProps>`
    font-size: 28px;
    font-weight: bold;
    color: white;

    ${props =>
        props.noDrawer &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `}
`;

export const MenuButton = styled(RectButton)`
    margin: 0 10px;
`;

export const MenuIcon = styled(Ionicons).attrs({
    name: 'menu-outline',
    size: 33,
    color: 'white',
})``;
