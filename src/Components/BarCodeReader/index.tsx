import React, { useCallback, useRef } from 'react';
import { RNCamera } from 'react-native-camera';

import { translate } from '../../Locales';

import GenericButton from '../Button';

import { Container, BarCodeTitle, CameraContainer, Camera } from './styles';

interface Props {
    onCodeRead: (code: string) => void;
    onClose: () => void;
}

const BarCodeReader: React.FC<Props> = ({ onCodeRead, onClose }: Props) => {
    const CameraRef = useRef<RNCamera>(null);

    const handleCodeRead = useCallback(
        ({ data }) => {
            onCodeRead(data);
        },
        [onCodeRead]
    );

    return (
        <Container>
            <BarCodeTitle>{translate('BarCodeReader_PageTitle')}</BarCodeTitle>
            <CameraContainer>
                <Camera
                    ref={CameraRef}
                    captureAudio={false}
                    type="back"
                    autoFocus="on"
                    flashMode="auto"
                    ratio="4:3"
                    googleVisionBarcodeType={
                        Camera.Constants.GoogleVisionBarcodeDetection
                            .BarcodeType.EAN_13
                    }
                    googleVisionBarcodeMode={
                        Camera.Constants.GoogleVisionBarcodeDetection
                            .BarcodeMode.ALTERNATE
                    }
                    barCodeTypes={[Camera.Constants.BarCodeType.ean13]}
                    onBarCodeRead={handleCodeRead}
                />
            </CameraContainer>

            <GenericButton
                text={translate('BarCodeReader_CloseButton')}
                onPress={onClose}
            />
        </Container>
    );
};

export default BarCodeReader;
