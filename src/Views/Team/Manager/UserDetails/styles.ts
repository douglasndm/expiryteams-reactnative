import styled from 'styled-components/native';
import { RadioButton as RadioPaper } from 'react-native-paper';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const PageContent = styled.View`
	padding: 15px 20px 0;
	flex: 1;
`;

export const UserName = styled.Text`
	font-size: 23px;
	font-weight: bold;
	color: ${({ theme }) => theme.colors.text};
	font-family: 'Open Sans';
`;

export const UserInfo = styled.Text`
	font-size: 16px;
	color: ${({ theme }) => theme.colors.text};
	font-family: 'Open Sans';
`;

export const CodeDetails = styled.View`
	margin-top: 15px;
	align-self: center;
	align-items: center;
`;

export const CodeTitle = styled.Text`
	color: ${({ theme }) => theme.colors.text};
	font-family: 'Open Sans';
	font-size: 16px;
`;

export const CodeContainer = styled.TouchableOpacity`
	margin-top: 10px;
	background-color: ${props => props.theme.colors.accent};
	padding: 18px 25px;
	border-radius: 8px;

	justify-content: center;
	align-items: center;
`;

export const Code = styled.Text`
	color: #fff;
	font-size: 16px;
	font-weight: bold;
`;

export const RadioButtonContainer = styled.View`
	flex-direction: row;
	justify-content: center;
`;

export const RadioButtonContent = styled.View`
	flex-direction: row;
	align-items: center;
	margin-right: 10px;
`;

export const RadioButton = styled(RadioPaper).attrs(props => ({
	color: props.theme.colors.accent,
	uncheckedColor: props.theme.colors.subText,
}))``;

export const RadioButtonText = styled.Text`
	color: ${({ theme }) => theme.colors.text};
`;
