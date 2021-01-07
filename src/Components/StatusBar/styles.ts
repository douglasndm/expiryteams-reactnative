import styled, { css } from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

export const Bar = styled(StatusBar).attrs((props) => ({
    backgroundColor: props.theme.colors.accent,
}))`
    height: 200px;

    ${Platform.OS === 'ios' &&
    css`
        height: 20px;
    `}
`;
