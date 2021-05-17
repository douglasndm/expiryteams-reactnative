import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { showMessage } from 'react-native-flash-message';

import { translate } from '../../Locales';

import GenericButton from '../Button';

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

    const checkIfCameraIsAllow = useCallback(async () => {
        let permissionResult;

        if (Platform.OS === 'ios') {
            permissionResult = await check(PERMISSIONS.IOS.CAMERA);
        } else {
            permissionResult = await check(PERMISSIONS.ANDROID.CAMERA);
        }

        switch (permissionResult) {
            case RESULTS.UNAVAILABLE:
                showMessage({
                    message: 'Camera is not available on this device',
                    type: 'danger',
                });
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
        ({ data }) => {
            onCodeRead(data);
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
                    <Camera onRead={handleCodeRead} />
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
        </Container>
    );
};

export default BarCodeReader;
