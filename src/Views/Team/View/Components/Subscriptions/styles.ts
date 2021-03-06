import styled from 'styled-components/native';

export const SubscriptionDescription = styled.Text`
    margin-top: 10px;
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
`;

export const SubscriptionContainer = styled.View`
    margin: 10px 0 0 0;
`;

export const SubscriptionTableTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 21px;

    margin-top: 20px;
`;

export const SubscriptionInformations = styled.Text`
    color: ${props => props.theme.colors.text};
`;
