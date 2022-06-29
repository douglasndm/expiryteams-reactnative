import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    background-color: ${props => props.theme.colors.background};
    flex: 1;
`;

export const List = styled.FlatList`
    margin: 10px 15px;
`;

export const LogCard = styled(RectButton)`
    margin: 2px 0;
    padding: 15px;
    border-radius: 12px;

    elevation: 2;

    background-color: ${props => props.theme.colors.productBackground};
`;

export const LogText = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 16px;
`;
