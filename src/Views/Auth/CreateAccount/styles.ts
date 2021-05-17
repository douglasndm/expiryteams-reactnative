import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex: 1;
    padding: ${Platform.OS === 'ios' ? 50 : 16}px 10px 5px 10px;
    background: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    flex-direction: row;
    margin-left: -15px;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
