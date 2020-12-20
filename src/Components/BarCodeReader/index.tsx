import React, { useCallback } from 'react';

import { translate } from '../../Locales';

import GenericButton from '../Button';

import { Container, BarCodeTitle, CameraContainer, Camera } from './styles';

interface Props {
    onCodeRead: (code: string) => void;
    onClose: () => void;
}

const BarCodeReader: React.FC<Props> = ({ onCodeRead, onClose }: Props) => {
    const handleCodeRead = useCallback(
        ({ nativeEvent }) => {
            const readedCode = nativeEvent.codeStringValue;
            onCodeRead(readedCode);
        },
        [onCodeRead]
    );

    return (
        <Container>
            <BarCodeTitle>{translate('BarCodeReader_PageTitle')}</BarCodeTitle>
            <CameraContainer>
                <Camera
                    scanBarcode
                    onReadCode={handleCodeRead} // optional
                    hideControls // (default false) optional, hide buttons and additional controls on top and bottom of screen
                    showFrame // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                    offsetForScannerFrame={10} // (default 30) optional, offset from left and right side of the screen
                    heightForScannerFrame={300} // (default 200) optional, change height of the scanner frame
                    colorForScannerFrame="red" // (default white) optional, change colot of the scanner frame
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
