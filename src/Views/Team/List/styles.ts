import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { darken } from 'polished';

export const Container = styled.View`
    flex: 1;
    padding: ${Platform.OS === 'ios' ? 60 : 16}px 10px 5px 10px;
    background-color: ${props => props.theme.colors.background};
`;

export const Title = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 26px;
    margin-left: 10px;
`;

export const Content = styled.View`
    flex: 1;
`;

export const ListTeamsTitle = styled.Text`
    margin: 15px 15px 0;
    color: ${props => props.theme.colors.text};
    font-size: 18px;
    font-family: 'Open Sans';
`;

export const ListCategories = styled.FlatList`
    margin: 0 10px;
    margin-top: 10px;
`;

interface TeamItemContainerProps {
    isPending?: boolean;
}

export const TeamItemContainer = styled(RectButton)<TeamItemContainerProps>`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 12px;

    flex-direction: row;
    justify-content: space-between;

    ${props =>
        props.isPending &&
        css`
            background-color: ${darken(
                0.13,
                props.theme.colors.inputBackground
            )};
        `}
`;

export const TeamItemTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 18px;
`;

export const TeamItemRole = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 15px;
`;

export const Footer = styled.View``;
