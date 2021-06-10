import styled from 'styled-components/native';
import { RadioButton as Radio } from 'react-native-paper';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.ScrollView``;

export const OptionContainer = styled.View`
    margin: 10px;
    padding: 20px;
    border-radius: 12px;
    background-color: ${props => props.theme.colors.productBackground};
`;

export const ExplainText = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.colors.text};
`;

export const SortTitle = styled.Text`
    font-size: 15px;
    font-weight: bold;
    margin: 20px 0 0 0;

    color: ${props => props.theme.colors.text};
`;

export const RadioButtonGroupContainer = styled.View`
    justify-content: center;
    align-items: center;
`;

export const RadioButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 200px;
`;

export const RadioButtonText = styled.Text`
    color: ${props => props.theme.colors.text};
`;

export const RadioButton = styled(Radio)``;
