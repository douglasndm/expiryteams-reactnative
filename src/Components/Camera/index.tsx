import React, { useState, useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { unlink } from 'react-native-fs';
import { RNCamera } from 'react-native-camera';
import { showMessage } from 'react-native-flash-message';

import { translate } from '../../Locales';

import BackButton from '../BackButton';
import Button from '../Button';

import {
    Container,
    PageHeader,
    PageTitle,
    CameraContainer,
    CameraComponent,
    ButtonsContainer,
} from './styles';

export interface onPhotoTakedProps {
    fileName: string;
    filePath: string;
}
interface CameraProps {
    onPhotoTaked: ({ fileName, filePath }: onPhotoTakedProps) => void;
    onBackButtonPressed?: () => void;
}

const Camera: React.FC<CameraProps> = ({
    onPhotoTaked,
    onBackButtonPressed,
}: CameraProps) => {
    const { goBack } = useNavigation();

    const cameraRef = useRef(null);

    const [image, setImage] = useState<string | null>(null);
    const [photoTaked, setPhotoTalked] = useState<boolean>(false);
    const [takingPhoto, setIsTakingPhoto] = useState<boolean>(false);

    const handleCapturePicture = useCallback(async () => {
        try {
            if (cameraRef && cameraRef.current) {
                const options = {
                    quality: 0.5,
                    base64: true,
                    pauseAfterCapture: true,
                    orientation: RNCamera.Constants.Orientation.portrait,
                };
                const data = await cameraRef.current.takePictureAsync(options);

                setImage(data.uri);
                setPhotoTalked(true);
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsTakingPhoto(false);
        }
    }, []);

    const handleTakeAnotherPhoto = useCallback(async () => {
        try {
            if (image) {
                await unlink(image);
            }

            setImage(null);
            setPhotoTalked(false);

            if (cameraRef && cameraRef.current) {
                await cameraRef.current.resumePreview();
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [image]);

    const handleSavePhoto = useCallback(async () => {
        if (image) {
            // const path = await copyImageFromTempDirToDefinitiveDir(image);
            // onPhotoTaked(path);
        }
    }, [image, onPhotoTaked]);

    return (
        <Container>
            <PageHeader>
                <BackButton handleOnPress={onBackButtonPressed || goBack} />
                <PageTitle>
                    {!image
                        ? translate('Component_Camera_PageTitle')
                        : translate('Component_Camera_PageTitle_OnPreview')}
                </PageTitle>
            </PageHeader>

            <CameraContainer>
                <CameraComponent ref={cameraRef} />
            </CameraContainer>

            <ButtonsContainer>
                {!photoTaked ? (
                    <Button
                        text={translate('Component_Camera_Button_TakePicture')}
                        onPress={handleCapturePicture}
                        isLoading={takingPhoto}
                    />
                ) : (
                    <>
                        <Button
                            text={translate(
                                'Component_Camera_Button_TakeAnotherPicture'
                            )}
                            onPress={handleTakeAnotherPhoto}
                            contentStyle={{ marginRight: 10 }}
                        />
                        <Button
                            text={translate(
                                'Component_Camera_Button_SavePicture'
                            )}
                            onPress={handleSavePhoto}
                        />
                    </>
                )}
            </ButtonsContainer>
        </Container>
    );
};

export default Camera;
