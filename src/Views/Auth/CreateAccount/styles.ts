import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex: 1;
    padding: ${Platform.OS === 'ios' ? 50 : 16}px 10px 5px 10px;
    background: ${props => props.theme.colors.background};
`;
