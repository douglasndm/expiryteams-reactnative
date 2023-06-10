import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const LoadingIndicator = styled.ActivityIndicator.attrs(props => ({
	size: 32,
	color: props.theme.colors.accent,
}))`
	margin-top: 15px;
`;

export const OptionContainer = styled.View`
	margin-top: 25px;
`;

export const ButtonPaper = styled(Button).attrs(() => ({
	color: 'red',
}))``;

export const Icons = styled(Ionicons)`
	color: ${({ theme }) => theme.colors.text};
`;
