import styled from 'styled-components/native';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.ScrollView`
	padding-top: 15px;
`;

export const InputGroupTitle = styled.Text`
	font-family: 'Open Sans';
	font-size: 18px;
	text-align: right;
	margin: 5px 15px 5px;
	color: ${({ theme }) => theme.colors.subText};
`;

export const InputGroup = styled.View`
	margin: 0 10px 10px;
`;

export const InputTextTip = styled.Text`
	color: red;
	margin: -5px 10px 5px;
`;
