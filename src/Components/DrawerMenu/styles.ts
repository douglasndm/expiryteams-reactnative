import styled from 'styled-components/native';
import { Drawer } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

import LogoImg from '~/Assets/Logo.png';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const LogoContainer = styled.View`
    margin-top: -10px;
    background-color: ${props => props.theme.colors.accent};
    align-items: center;
`;

export const Logo = styled.Image.attrs(() => ({
    source: LogoImg,
    resizeMode: 'cover',
}))`
    width: 120px;
    height: 120px;
`;

export const MenuItemContainer = styled(RectButton)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
`;

export const MenuContent = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const MenuItemText = styled.Text`
    margin-left: 20px;
    color: ${props => props.theme.colors.text};
`;

export const Icons = styled(Ionicons).attrs(() => ({
    size: 22,
}))`
    color: ${({ theme }) => theme.colors.text};
`;

export const DrawerSection = styled(Drawer.Section)``;

export const LabelGroup = styled.View`
    flex-direction: row;
`;

export const LabelContainer = styled.View`
    padding: 5px 10px;
    background-color: #eaeaea;
    margin-right: 5px;
`;

export const Label = styled.Text``;
