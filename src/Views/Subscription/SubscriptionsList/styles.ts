import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

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

    ${props =>
        props.isSelected &&
        css`
            background-color: ${({ theme }) => theme.colors.inputBackground};
        `}
`;

export const SubscriptionPeriodContainer = styled.View<Offer>`
    background-color: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
`;

export const DetailsContainer = styled.View`
    flex: 1;
    justify-content: center;
    padding: 12px;
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
        `}
`;

export const ButtonSubscription = styled.TouchableOpacity`
    background-color: ${props => props.theme.colors.accent};
    margin: 0 10px 10px 10px;
    padding: 15px;
    border-radius: 12px;
`;

export const TextSubscription = styled.Text<Offer>`
    text-align: center;
    color: white;
    font-size: 17px;

    ${props =>
        props.isSelected &&
        css`
            color: #000;
        `}
`;
