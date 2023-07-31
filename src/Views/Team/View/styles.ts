import styled from 'styled-components/native';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
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
