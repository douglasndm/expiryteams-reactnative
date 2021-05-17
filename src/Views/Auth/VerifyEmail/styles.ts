import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
    justify-content: center;
    align-items: center;
`;

export const Content = styled.View`
    justify-content: center;
    align-items: center;
`;

export const WaitingConfirmationEmail = styled.Text`
    margin-top: 25px;
    font-family: 'Open Sans';
    font-size: 21px;
    text-align: center;
    font-weight: bold;
`;

export const EmailConfirmationExplain = styled.Text`
    margin: 15px;
    font-family: 'Open Sans';
    text-align: center;
`;
