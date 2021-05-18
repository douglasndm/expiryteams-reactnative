import styled, { css } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
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

export const AddCategoryContent = styled.View`
    flex-direction: column;
`;

export const InputContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin: 10px 5px;
`;

interface InputTextContainerProps {
    hasError?: boolean;
}

export const InputTextContainer = styled.View<InputTextContainerProps>`
    flex: 1;
    margin-right: 7px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.inputBackground};

    ${props =>
        props.hasError &&
        css`
            border: 2px solid red;
        `}
`;

export const InputText = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    padding: 15px 5px 15px 15px;
    font-size: 18px;
    color: ${props => props.theme.colors.text};
`;

export const AddCategoryButtonContainer = styled(RectButton)`
    background-color: ${props => props.theme.colors.accent};
    padding: 13px 15px;
    border-radius: 12px;
`;
export const ListTitle = styled.Text`
    margin: 10px 15px 10px;
    font-size: 20px;
    color: ${props => props.theme.colors.accent};
`;

export const ListCategories = styled.FlatList`
    margin: 0 10px;
`;

export const CategoryItemContainer = styled(RectButton)`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 12px;

    flex-direction: row;
    justify-content: space-between;
`;

export const CategoryItemTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 18px;
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
