import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { Button, FAB } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.ScrollView`
    flex: 1;
    background: ${({ theme }) => theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: column;
    justify-content: space-between;

    padding: ${Platform.OS === 'ios' ? 0 : 10}px 5px 10px 5px;
`;

export const ProductContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin: 15px 10px 10px;
`;

export const ProductInformationContent = styled.View`
    flex: 1;
`;

export const ProductName = styled.Text`
    font-size: 20px;
    margin-left: 15px;
    color: ${({ theme }) => theme.colors.text};
`;

export const ProductCode = styled.Text`
    font-size: 14px;
    margin: 5px 15px;
    color: ${({ theme }) => theme.colors.text};
`;

export const ProductInfo = styled.Text`
    font-size: 14px;
    margin: 5px 15px;
    color: ${({ theme }) => theme.colors.text};
`;

export const ProductImageContainer = styled(RectButton)``;

export const ProductImage = styled.Image`
    width: 75px;
    height: 75px;
    border-radius: 37px;
`;

export const ActionsButtonContainer = styled.View`
    flex-direction: row;
`;

export const ActionButton = styled(Button).attrs(props => ({
    color: props.theme.colors.accent,
}))``;

export const PageContent = styled.View`
    padding: 0 16px 140px 16px;
`;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const CategoryDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;

    margin: 10px 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: ${props => props.theme.colors.accent};
    font-size: 18px;
`;

export const TableContainer = styled.View``;

export const FloatButton = styled(FAB).attrs(() => ({
    color: 'white',
}))`
    background-color: ${({ theme }) => theme.colors.accent};

    position: absolute;
    bottom: 20px;
    right: 20px;
`;
