import styled from 'styled-components/native';

export const PageContainer = styled.View`
	flex: 1;
	background: ${({ theme }) => theme.colors.background};
`;
export const PageContent = styled.ScrollView`
	padding: 0 16px 0 16px;
`;

export const ProductHeader = styled.View`
	margin: 0 5px 7px;
`;

export const ProductName = styled.Text`
	font-size: 32px;

	color: ${props => props.theme.colors.text};
`;

export const ProductCode = styled.Text`
	font-size: 18px;

	color: ${props => props.theme.colors.text};
`;
