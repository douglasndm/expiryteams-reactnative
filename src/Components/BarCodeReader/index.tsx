import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { translate } from '../../Locales';

import GenericButton from '../Button';
import Notification from '../Notification';

import {
    Container,
    BarCodeTitle,
    CameraContainer,
    Camera,
    AuthorizationCameraContainer,
    AuthorizationCameraText,
} from './styles';

interface Props {
    onCodeRead: (code: string) => void;
    onClose: () => void;
}

const BarCodeReader: React.FC<Props> = ({ onCodeRead, onClose }: Props) => {
    const [cameraAllowed, setCameraAllowed] = useState<boolean>(false);
    const [isCameraBlocked, setIsCameraBlocked] = useState<boolean>(false);

    const [error, setError] = useState<string>('');

    const checkIfCameraIsAllow = useCallback(async () => {
        let permissionResult;

        if (Platform.OS === 'ios') {
            permissionResult = await check(PERMISSIONS.IOS.CAMERA);
        } else {
            permissionResult = await check(PERMISSIONS.ANDROID.CAMERA);
        }

        switch (permissionResult) {
            case RESULTS.UNAVAILABLE:
                setError('Camera is not available on this device');
                setCameraAllowed(false);
                break;
            case RESULTS.DENIED:
                setCameraAllowed(false);
                break;
            case RESULTS.LIMITED:
                setCameraAllowed(false);
                break;
            case RESULTS.GRANTED:
                setCameraAllowed(true);
                break;
            case RESULTS.BLOCKED:
                setCameraAllowed(false);
                setIsCameraBlocked(true);
                break;
            default:
                setCameraAllowed(false);
        }
    }, []);

    const requestCameraAuthorization = useCallback(async () => {
        if (Platform.OS === 'ios') {
            await request(PERMISSIONS.IOS.CAMERA);
        } else {
            await request(PERMISSIONS.ANDROID.CAMERA);
        }
        checkIfCameraIsAllow();
    }, [checkIfCameraIsAllow]);

    const handleCodeRead = useCallback(
        ({ nativeEvent }) => {
            const readedCode = nativeEvent.codeStringValue;
            onCodeRead(readedCode);
        },
        [onCodeRead]
    );

    useEffect(() => {
        checkIfCameraIsAllow();
    }, [checkIfCameraIsAllow]);

    return (
        <Container>
            <BarCodeTitle>{translate('BarCodeReader_PageTitle')}</BarCodeTitle>
            {cameraAllowed ? (
                <CameraContainer>
                    <Camera
                        scanBarcode
                        onReadCode={handleCodeRead} // optional
                        hideControls // (default false) optional, hide buttons and additional controls on top and bottom of screen
                        showFrame // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                        offsetForScannerFrame={0} // (default 30) optional, offset from left and right side of the screen
                        heightForScannerFrame={250} // (default 200) optional, change height of the scanner frame
                    />
                </CameraContainer>
            ) : (
                <AuthorizationCameraContainer>
                    {isCameraBlocked ? (
                        <AuthorizationCameraText>
                            {translate('BarCodeReader_PermissionBlocked')}
                        </AuthorizationCameraText>
                    ) : (
                        <AuthorizationCameraText>
                            {translate('BarCodeReader_PermissionRequired')}
                        </AuthorizationCameraText>
                    )}

                    {!isCameraBlocked && (
                        <GenericButton
                            text={translate(
                                'BarCodeReader_Button_RequestPermission'
                            )}
                            onPress={() => requestCameraAuthorization()}
                        />
                    )}
                </AuthorizationCameraContainer>
            )}

            <GenericButton
                text={translate('BarCodeReader_CloseButton')}
                onPress={onClose}
            />

            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={() => setError('')}
                />
            )}
        </Container>
    );
};

export default BarCodeReader;
