import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View``;

export const ProBanner = styled(RectButton)`
    background-color: ${(props) => props.theme.colors.accent};
    border-radius: 12px;
    margin: 5px 10px 5px 10px;
`;

export const ProText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #fff;
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
    color: ${(props) => props.theme.colors.textAccent};
    font-size: 18px;
`;

export const EmptyListText = styled.Text`
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
    color: ${({ theme }) => theme.colors.text};
`;
