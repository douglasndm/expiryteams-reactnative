import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
	flex: 1;
`;

export const EmptyListText = styled.Text`
	margin-top: 10px;
	margin-left: 15px;
	margin-right: 15px;
	color: ${({ theme }) => theme.colors.text};
`;

export const ProductContainer = styled.Pressable`
	flex-direction: row;
`;

export const SelectButtonContainer = styled.View`
	justify-content: center;
`;

export const SelectButton = styled.Pressable`
	margin-left: 7px;
`;

export const SelectIcon = styled(Ionicons).attrs(() => ({
	size: 28,
}))``;
