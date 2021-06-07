import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${props => props.theme.colors.background};
    justify-content: center;
`;

export const Content = styled.View`
    align-items: center;
`;

export const ErrorTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 25px;

    margin-top: 10px;
`;

export const ErrorDescription = styled.Text`
    color: ${props => props.theme.colors.text};
    margin-top: 10px;
`;
