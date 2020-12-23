import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

export const Bar = styled.StatusBar.attrs((props) => ({
    backgroundColor: props.theme.colors.accent,
}))`
    height: ${Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}px;
`;
