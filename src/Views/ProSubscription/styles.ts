import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.ScrollView`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

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
