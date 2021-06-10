import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { darken } from 'polished';

export const Container = styled.View``;

export const SubscriptionsGroup = styled.View`
    flex-direction: row;
    flex: 1;
    justify-content: center;
    margin: 0 10px 15px;
`;

interface Offer {
    isSelected?: boolean;
}

export const SubscriptionContainer = styled(RectButton)<Offer>`
    flex: 1;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    max-width: 150px;
    margin: 10px 5px;

    background-color: ${props => props.theme.colors.subscriptionBackground};
`;

export const SubscriptionPeriodContainer = styled.View<Offer>`
    background-color: rgba(200, 200, 200, 0.5);
    padding: 15px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;

    ${props =>
        props.isSelected &&
        css`
            background-color: ${({ theme }) => theme.colors.accent};
        `}
`;

export const TeamMembersLimit = styled.Text<Offer>`
    text-align: center;
    color: white;
    font-size: 17px;

    ${props =>
        !props.isSelected &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `}
`;

export const DetailsContainer = styled.View<Offer>`
    flex: 1;
    justify-content: center;
    padding: 12px;

    background-color: ${({ theme }) => theme.colors.productBackground};

    ${props =>
        props.isSelected &&
        css`
            background-color: ${({ theme }) =>
                darken(0.13, theme.colors.productBackground)};
        `}
`;

export const SubscriptionDescription = styled.Text.attrs(() => ({
    textBreakStrategy: 'simple',
}))<Offer>`
    color: white;
    text-align: center;
    align-self: center;
    font-size: 16px;
    ${props =>
        props.isSelected &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `};
`;

export const ButtonSubscription = styled.TouchableOpacity`
    background-color: ${props => props.theme.colors.accent};
    margin: 0 10px 10px 10px;
    padding: 15px;
    border-radius: 12px;
`;

export const TextSubscription = styled.Text<Offer>`
    text-align: center;
    font-size: 17px;

    color: ${({ theme }) => theme.colors.text};
`;

export const ButtonText = styled.Text`
    text-align: center;
    color: white;
    font-size: 17px;
`;
