import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.ScrollView.attrs(() => ({
    contentContainerStyle: { flexGrow: 1 },
}))`
    background-color: ${props => props.theme.colors.background};
`;

export const HeaderContainer = styled.View`
    background-color: ${props => props.theme.colors.accent};
    margin-left: -16px;
    margin-top: -22px;
    padding-top: ${Platform.OS === 'ios' ? 40 : 0}px;
    width: 120%;
    transform: rotate(-4deg);
`;

export const TitleContainer = styled.View`
    margin: 25px 25px 0;
    transform: rotate(4deg);
`;

export const AppNameTitle = styled.Text`
    font-size: 20px;
    color: white;
    font-family: 'Open Sans';
`;

export const IntroductionText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: white;
    font-family: 'Open Sans';
`;

export const PremiumTitle = styled.Text`
    font-size: 52px;
    font-weight: bold;
    color: white;

    font-family: 'Open Sans';
`;

export const Content = styled.View`
    flex-grow: 1;
`;

export const AdvantagesGroup = styled.View`
    margin-top: 35px;
    padding-left: 10px;
    padding-right: 10px;
`;

export const AdvantageContainer = styled.View`
    background-color: ${props => props.theme.colors.productBackground};
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 15px;
    elevation: 1;
`;

export const AdvantageText = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 16px;
    text-align: center;
`;

export const ButtonSubscription = styled.TouchableOpacity`
    background-color: ${props => props.theme.colors.accent};
    margin: 0 10px 10px 10px;
    padding: 15px;
    border-radius: 12px;
`;

export const TextSubscription = styled.Text`
    text-align: center;
    color: white;
    font-size: 18px;
`;

export const TermsPrivacyContainer = styled.View`
    padding-bottom: 25px;
`;

export const TermsPrivacyText = styled.Text`
    margin: 10px;
    text-align: center;
    color: ${props => props.theme.colors.text};
`;

export const TermsPrivacyLink = styled.Text`
    color: ${props => props.theme.colors.accent};
`;
