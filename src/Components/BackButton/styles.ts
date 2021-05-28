import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const ButtonContainer = styled(RectButton).attrs(props => ({
    rippleColor: props.theme.colors.accent,
}))`
    padding: 2px 7px;
    margin: 0 3px;
    justify-content: center;
`;

export const BackButtonImage = styled(Ionicons).attrs(props => ({
    name: 'arrow-back-outline',
    color: props.theme.colors.text,
    size: 28,
}))``;
