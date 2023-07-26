import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Icons = styled(Ionicons)`
	color: ${({ theme }) => theme.colors.text};
`;
