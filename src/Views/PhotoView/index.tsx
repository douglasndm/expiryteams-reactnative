import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { exists } from 'react-native-fs';

import strings from '../../Locales';

import Loading from '~/Components/Loading';
import BackButton from '../../Components/BackButton';
import Button from '../../Components/Button';

import { Container, PageHeader, PageTitle, Image } from './styles';

interface Props {
    productId: string;
}

const PhotoView: React.FC<Props> = () => {
    const [photoPath, setPhotoPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { params } = useRoute();
    const routeParams = params as Props;

    const { goBack } = useNavigation();

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <Container>
                    <PageHeader>
                        <BackButton handleOnPress={goBack} />
                        <PageTitle>
                            {strings.View_PhotoView_PageTitle}
                        </PageTitle>
                    </PageHeader>

                    {!!photoPath && <Image source={{ uri: photoPath }} />}
                    <Button
                        text={strings.View_PhotoView_Button_Back}
                        onPress={goBack}
                    />
                </Container>
            )}
        </>
    );
};

export default PhotoView;
