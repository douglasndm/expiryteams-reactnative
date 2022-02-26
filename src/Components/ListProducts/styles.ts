import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { FAB, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
`;

export const ActionButtonsContainer = styled.View`
    flex-direction: column;
    align-items: flex-end;
    margin: 5px 10px;
`;

export const ButtonPaper = styled(Button).attrs(props => ({
    color: props.theme.colors.textAccent,
}))``;

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
    margin-bottom: 75px;
`;

export const FloatButton = styled(FAB).attrs(() => ({
    color: 'white',
}))`
    background-color: ${({ theme }) => theme.colors.accent};

    position: absolute;
    bottom: 20px;
    right: 20px;
`;

export const ProductContainer = styled.Pressable`
    flex-direction: row;
`;

export const Icons = styled(Ionicons).attrs(props => ({
    size: 22,
    color: props.theme.colors.text,
}))``;

export const SelectButtonContainer = styled.View`
    justify-content: center;
`;

export const SelectButton = styled(RectButton)`
    margin-left: 7px;
`;

export const SelectIcon = styled(Ionicons).attrs(() => ({
    size: 28,
}))``;
