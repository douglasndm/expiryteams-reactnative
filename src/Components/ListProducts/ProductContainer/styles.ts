import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View``;

export const AdView = styled.View`
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
`;

export const ButtonPro = styled(RectButton)`
    background: ${(props) => props.theme.colors.accent};
    padding: 12px;
    border-radius: 10px;
    margin: 5px 15px 0;
`;

export const ButtonProText = styled.Text`
    font-size: 15px;
    color: #fff;
    text-align: center;
`;
