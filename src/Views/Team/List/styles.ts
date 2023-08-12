import styled, { css } from 'styled-components/native';
import { darken } from 'polished';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
	padding: 10px;
	flex: 1;
`;

export const EmptyText = styled.Text`
	font-family: 'Open Sans';
	font-size: 14px;
	color: ${props => props.theme.colors.text};
`;

export const ListTeamsTitle = styled.Text`
	margin: 10px 15px;
	color: ${props => props.theme.colors.text};
	font-size: 20px;
	font-family: 'Open Sans';
`;

interface TeamItemContainerProps {
	isPending?: boolean;
}

export const TeamItemContainer = styled.TouchableOpacity<TeamItemContainerProps>`
	background-color: ${props => props.theme.colors.inputBackground};
	padding: 20px;
	margin-bottom: 10px;
	border-radius: 12px;

	flex-direction: row;
	justify-content: space-between;

	${props =>
		props.isPending &&
		css`
			background-color: ${darken(
				0.13,
				props.theme.colors.inputBackground
			)};
		`}
`;

export const TeamItemTitle = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 18px;
`;

export const TeamItemRole = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 15px;
`;

export const Footer = styled.View``;
