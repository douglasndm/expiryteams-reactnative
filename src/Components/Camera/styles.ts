import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';

export const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    justify-content: space-between;
    padding: ${Platform.OS === 'ios' ? 50 : 16}px 0 5px;
`;

export const PageHeader = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

export const CameraContainer = styled.View`
    flex: 1;
`;

export const CameraComponent = styled(RNCamera).attrs(() => ({
    captureAudio: false,
}))`
    flex: 1;
`;

export const ButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: center;
`;
