import styled from 'styled-components/native';
import { RadioButton as RadioPaper } from 'react-native-paper';

export const Container = styled.View`
	background-color: ${props => props.theme.colors.background};
	flex: 1;
`;

export const ContentHeader = styled.View`
	flex-direction: row;
`;

export const RadioButton = styled(RadioPaper).attrs(props => ({
	color: props.theme.colors.accent,
	uncheckedColor: props.theme.colors.subText,
}))``;

export const RadioButtonText = styled.Text`
	color: ${({ theme }) => theme.colors.text};
`;
