import styled, { css } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
	flex: 1;
	background: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.ScrollView``;

export const PageContent = styled.View`
	padding: 0 16px 0 16px;
`;

export const InputContainer = styled.View`
	margin-top: 25px;
`;

export const InputGroup = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 10px 0;
`;

interface InputTextContainerProps {
	hasError?: boolean;
}

export const InputTextTip = styled.Text`
	color: red;
	margin: -5px 10px 5px;
`;

export const InputCodeTextContainer = styled.View<InputTextContainerProps>`
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border: 1px solid rgba(0, 0, 0, 0.1);
	margin-bottom: 10px;
	border-radius: 12px;
	background-color: ${({ theme }) => theme.colors.inputBackground};
	padding-right: 10px;

	${props =>
		props.hasError &&
		css`
			border: 2px solid red;
		`}
`;

export const InputTextLoading = styled.ActivityIndicator.attrs(props => ({
	size: 26,
	color: props.theme.colors.text,
}))`
	margin-right: 7px;
	margin-left: 7px;
`;

export const InputTextIconContainer = styled.Pressable``;

export const Icon = styled(Ionicons).attrs(props => ({
	color: props.theme.colors.inputText,
}))``;

export const InputCodeText = styled.TextInput.attrs(props => ({
	placeholderTextColor: props.theme.colors.placeholderColor,
}))`
	flex: 1;
	padding: 15px 5px 15px 15px;
	font-size: 18px;
	color: ${props => props.theme.colors.inputText};
`;

export const MoreInformationsContainer = styled.View``;

export const MoreInformationsTitle = styled.Text`
	font-size: 16px;
	text-align: right;
	color: ${({ theme }) => theme.colors.subText};
	margin-bottom: 5px;
`;
