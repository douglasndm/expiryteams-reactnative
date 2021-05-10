import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const ListCategories = styled.FlatList`
    margin: 0 10px;
    margin-top: 15px;
`;

export const TeamItemContainer = styled(RectButton)`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 12px;

    flex-direction: row;
    justify-content: space-between;
`;

export const TeamItemTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 18px;
`;

export const TeamItemRole = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 15px;
`;

export const Icons = styled(Ionicons).attrs(() => ({
    size: 22,
    color: '#fff',
}))``;

export const LoadingIcon = styled.ActivityIndicator.attrs(() => ({
    size: 22,
    color: '#fff',
}))``;

export const InputTextTip = styled.Text`
    color: red;
    margin: -5px 10px 5px;
`;
