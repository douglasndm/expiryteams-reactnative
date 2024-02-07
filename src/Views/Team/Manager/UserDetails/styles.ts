import styled from 'styled-components/native';
import { RadioButton as RadioPaper } from 'react-native-paper';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const PageContent = styled.ScrollView`
	padding: 15px 10px 0;
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

export const SettingContainer = styled.View`
	margin-top: 20px;
	padding: 15px 15px 25px;
	background-color: ${props => props.theme.colors.productBackground};
	border-radius: 12px;
`;

export const SettingTitle = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-family: 'Open Sans';
	font-size: 18px;
	font-weight: bold;
`;

export const SettingDescription = styled.Text`
	margin-top: 10px;
	color: ${props => props.theme.colors.productCardText};
	font-family: 'Open Sans';
`;

export const RoleText = styled.Text`
	font-weight: bold;
`;

export const RadioButtonGroup = styled(RadioPaper.Group)``;

export const RadioButtonItem = styled(RadioPaper.Item).attrs(props => ({
	color: props.theme.colors.accent,
	uncheckedColor: props.theme.colors.subText,
}))``;
