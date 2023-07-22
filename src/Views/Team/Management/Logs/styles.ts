import styled from 'styled-components/native';

export const Container = styled.View`
	background-color: ${props => props.theme.colors.background};
	flex: 1;
`;

export const List = styled.FlatList`
	margin: 10px 15px;
`;

export const LogCard = styled.Pressable`
	margin: 2px 0;
	padding: 15px;
	border-radius: 12px;

	elevation: 2;

	background-color: ${props => props.theme.colors.productBackground};
`;

export const LogText = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 16px;
`;
