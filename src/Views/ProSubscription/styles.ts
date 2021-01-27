import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface Offer {
    isSelected?: boolean;
}

export const Container = styled.View`
    background-color: ${(props) => props.theme.colors.background};
`;

export const Scroll = styled.ScrollView``;

export const HeaderContainer = styled.View`
    background-color: ${(props) => props.theme.colors.accent};
    margin-left: -16px;
    margin-top: -22px;
    padding-top: ${Platform.OS === 'ios' ? 40 : 0}px;
    width: 120%;
    transform: rotate(-4deg);
`;

export const TitleContainer = styled.View`
    margin-top: 25px;
    margin-left: 30px;
    transform: rotate(4deg);
`;

export const IntroductionText = styled.Text`
    font-size: 28px;
    color: white;
`;

export const AppNameTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: white;
`;

export const PremiumTitle = styled.Text`
    font-size: 58px;
    font-weight: bold;
    color: white;
`;

export const AdvantagesGroup = styled.View`
    margin-top: 35px;
    padding-left: 10px;
    padding-right: 10px;
`;

export const AdvantageContainer = styled.View`
    background-color: ${(props) => props.theme.colors.productBackground};
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 15px;
    elevation: 1;
`;

export const AdvantageText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    text-align: center;
`;

export const ButtonSubscription = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.colors.accent};
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 12px;
`;

export const TextSubscription = styled.Text`
    text-align: center;
    color: white;
    font-size: 18px;
`;

export const LoadingIndicator = styled.ActivityIndicator.attrs(() => ({
    color: '#fff',
    size: 36,
}))``;

export const SubscriptionsGroup = styled.View`
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    margin: 0 10px 15px;
`;

export const SubscriptionContainer = styled(RectButton)<Offer>`
    flex: 1;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 12px;

    ${(props) =>
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

export const SubscriptionPeriod = styled.Text`
    color: white;
    text-align: center;
    font-size: 15px;
    font-weight: 300;
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

    ${(props) =>
        props.isSelected &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `}
`;

export const SubscriptionPrice = styled.Text<Offer>`
    color: white;

    ${(props) =>
        props.isSelected &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `}
`;

export const SubscriptionIntroPrice = styled.Text<Offer>`
    color: white;

    ${(props) =>
        props.isSelected &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `}
`;
