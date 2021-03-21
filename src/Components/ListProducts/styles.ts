import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
`;

export const ProBanner = styled(RectButton)`
    background-color: #ffffff;
    border-radius: 12px;
    margin: 5px 10px 5px 10px;
`;

export const ProText = styled.Text`
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    color: #454545;
    margin: 15px;
`;

export const CategoryDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;

    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: ${props => props.theme.colors.textAccent};
    font-size: 18px;
`;

export const EmptyListText = styled.Text`
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
    color: ${({ theme }) => theme.colors.text};
`;

export const InvisibleComponent = styled.View`
    margin-bottom: 100px;
`;

export const FloatButton = styled(FAB).attrs(() => ({
    color: 'white',
}))`
    background-color: ${({ theme }) => theme.colors.accent};

    position: absolute;
    bottom: 20px;
    right: 20px;
`;

export const Icons = styled(Ionicons)``;
