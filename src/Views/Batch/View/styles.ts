import styled from 'styled-components/native';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
	justify-content: space-between;
`;

export const BatchContainer = styled.View`
	margin: 10px;
	flex: 1;
`;

export const BatchTitle = styled.Text`
	font-weight: bold;
	font-size: 22px;
	font-family: 'Open Sans';
	color: ${props => props.theme.colors.text};
`;

export const ExtraInfoContainer = styled.View`
	margin-top: 15px;
`;

export const BatchInfo = styled.Text`
	font-family: 'Open Sans';
	color: ${props => props.theme.colors.text};
`;

export const BatchExpDate = styled.Text`
	font-family: 'Open Sans';
	color: ${props => props.theme.colors.text};
`;

export const BatchAmount = styled.Text`
	font-family: 'Open Sans';
	color: ${props => props.theme.colors.text};
`;

export const BatchPrice = styled.Text`
	font-family: 'Open Sans';
	color: ${props => props.theme.colors.text};
`;

export const ButtonsCointaner = styled.View`
	margin-top: 15px;
`;
