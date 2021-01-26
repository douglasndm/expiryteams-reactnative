import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View``;

export const PremiumButtonsContainer = styled.View`
    justify-content: center;
    margin-top: 10px;
`;

export const ButtonPremium = styled(RectButton)`
    margin-bottom: 10px;
    background-color: ${(props) => props.theme.colors.accent};
    padding: 25px 15px;
    border-radius: 12px;
`;

export const ButtonPremiumText = styled.Text`
    font-size: 14px;
    color: #fff;
`;

export const Loading = styled.ActivityIndicator.attrs(() => ({
    size: 48,
    color: '#fff',
}))``;

export const ButtonCancel = styled.TouchableOpacity`
    margin-top: 15px;
    background-color: #999;
    padding: 13px;
    border-radius: 12px;
    align-self: center;
`;

export const ButtonCancelText = styled.Text`
    font-size: 13px;
    color: #fff;
`;
