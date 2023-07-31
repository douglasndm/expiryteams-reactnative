import styled from 'styled-components/native';

export const LoadingIndicator = styled.ActivityIndicator.attrs(props => ({
	size: 32,
	color: props.theme.colors.accent,
}))`
	margin-top: 15px;
`;
