import styled from 'styled-components/native';
import QRCodeScanner from 'react-native-qrcode-scanner';

export const Container = styled.SafeAreaView`
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

export const Camera = styled(QRCodeScanner).attrs((props) => ({
    showMarker: true,
    cameraType: 'back',
    fadeIn: true,
    markerStyle: {
        borderColor: props.theme.colors.accent,
        height: 125,
        width: 300,
    },
}))``;

export const AuthorizationCameraContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const AuthorizationCameraText = styled.Text`
    font-size: 22px;
    color: ${(props) => props.theme.colors.text};
    margin: 0 15px;
`;
