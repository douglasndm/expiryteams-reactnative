import styled from 'styled-components/native';
import { RadioButton as Radio } from 'react-native-paper';

export const Container = styled.View``;

export const Content = styled.View``;

export const ExportOptionContainer = styled.View`
    margin: 10px;
    padding: 20px;
    border-radius: 12px;
    background-color: ${props => props.theme.colors.productBackground};
`;

export const ExportExplain = styled.Text`
    font-size: 16px;
`;

export const SortTitle = styled.Text`
    font-size: 15px;
    font-weight: bold;
    margin: 20px 0 0 0;
`;

export const RadioButtonGroupContainer = styled.View`
    justify-content: center;
    align-items: center;
`;

export const RadioButtonContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const RadioButtonText = styled.Text``;

export const RadioButton = styled(Radio)``;
