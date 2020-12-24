import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { Drawer } from 'react-native-paper';
import { DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const MenuHeader = styled.View`
    background-color: ${({ theme }) => theme.colors.accent};
    padding: ${Platform.OS === 'ios' ? 50 : 20}px 25px 25px 25px;
    margin-top: ${Platform.OS === 'ios' ? -57 : -5}px;
`;

export const MenuHeaderTitle = styled.Text`
    font-size: 36px;
    color: #fff;
`;

export const LogoImage = styled.Image`
    width: 90%;
    height: 65px;
`;

export const MenuItem = styled(DrawerItem).attrs((props) => ({
    labelStyle: {
        color: props.theme.colors.text,
    },
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const DrawerSection = styled(Drawer.Section)``;
