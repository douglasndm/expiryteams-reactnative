import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const PageHeader = styled.View`
	flex-direction: row;
	margin: 0 10px;
`;

export const PageTitle = styled.Text`
	font-size: 28px;
	font-weight: bold;
	color: ${({ theme }) => theme.colors.text};
`;

export const PageContent = styled.ScrollView`
	padding: 15px 16px 100px;
`;

export const TeamHeaderContainer = styled.View`
	flex-direction: row;
	align-items: center;
	align-content: center;
	justify-content: space-between;
	margin-bottom: 10px;
`;

export const TeamName = styled.Text`
	color: ${props => props.theme.colors.text};
	font-family: 'Open Sans';
	font-size: 23px;
	font-weight: bold;
	flex: 1;
`;

export const Section = styled.View`
	background-color: ${props => props.theme.colors.inputBackground};
	padding: 20px 15px;
	border-radius: 12px;
	margin-bottom: 15px;
`;

export const SectionTitle = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-family: 'Open Sans';
	font-size: 21px;
	font-weight: bold;
`;

export const SubscriptionDescription = styled.Text`
	margin-top: 10px;
	color: ${props => props.theme.colors.productCardText};
	font-family: 'Open Sans';
`;

export const ButtonPaper = styled(Button).attrs(props => ({
	color: props.theme.colors.textAccent,
}))``;

export const Icons = styled(Ionicons)`
	color: ${({ theme }) => theme.colors.text};
`;

export const ActionsButtonContainer = styled.View`
	flex-direction: column;
	align-items: flex-start;
	margin-top: 5px;
`;
