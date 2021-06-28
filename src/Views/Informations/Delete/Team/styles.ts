import styled from 'styled-components/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export const Container = styled.ScrollView`
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    margin: 5%;
`;

export const ActionTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    font-family: 'Open Sans';
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.text};
`;

export const ActionDescription = styled.Text`
    font-family: 'Open Sans';
    margin-bottom: 7px;
    color: ${({ theme }) => theme.colors.text};
`;

export const ActionConsequence = styled.Text`
    font-family: 'Open Sans';
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

export const CheckBoxContainer = styled.View`
    margin: 5% 0;
    align-items: center;
`;

export const CheckBox = styled(BouncyCheckbox).attrs(props => ({
    fillColor: props.theme.colors.accent,
    iconStyle: { borderColor: props.theme.colors.subText },
    textStyle: {
        textDecorationLine: 'none',
        color: props.theme.colors.subText,
    },
}))``;

interface ViewEnableProps {
    isEnable?: boolean;
}

export const BlockContainer = styled.View<ViewEnableProps>`
    opacity: ${props => (props.isEnable ? 1 : 0.1)};
    margin-top: 5%;
`;

export const BlockTitle = styled.Text`
    font-family: 'Open Sans';
    font-size: 22px;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text};
`;

export const BlockDescription = styled.Text`
    font-family: 'Open Sans';
    margin-bottom: 7px;
    color: ${({ theme }) => theme.colors.text};
`;

export const Link = styled.Text`
    color: ${props => props.theme.colors.accent};
    font-size: 20px;
    text-align: center;
`;
