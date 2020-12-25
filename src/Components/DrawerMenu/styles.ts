import styled from 'styled-components/native';
import { Drawer } from 'react-native-paper';
import { DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
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
