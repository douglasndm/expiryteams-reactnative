import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex: 1;
    padding: ${Platform.OS === 'ios' ? 50 : 16}px 10px 5px 10px;
    background: ${(props) => props.theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

export const Image = styled.Image`
    margin-top: 15px;
    border-radius: 12px;
    flex: 1;
`;
