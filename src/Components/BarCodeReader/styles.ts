import styled from 'styled-components/native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;

export const BarCodeTitle = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 28px;
    margin: 10px;
`;

export const CameraContainer = styled.View`
    flex: 1;
`;

export const Camera = styled(CameraKitCameraScreen).attrs((props) => ({
    frameColor: props.theme.colors.accent,
    laserColor: props.theme.colors.accent,
}))``;
