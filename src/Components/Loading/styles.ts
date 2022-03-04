import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${props => props.theme.colors.background};
    justify-content: center;
`;

export const LoadingIndicator = styled.ActivityIndicator.attrs(props => ({
    size: 88,
    color: props.theme.colors.accent,
}))``;

export const LoadingText = styled.Text`
    color: ${props => props.theme.colors.text};
    margin-top: 15px;
    font-size: 28px;
    text-align: center;
`;
