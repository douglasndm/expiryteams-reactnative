import styled from 'styled-components/native';
import { FAB } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Float = styled(FAB).attrs(() => ({
    color: 'white',
}))`
    background-color: ${({ theme }) => theme.colors.accent};

    position: absolute;
    bottom: 35px;
    right: 20px;
`;

export const Icons = styled(Ionicons)``;
