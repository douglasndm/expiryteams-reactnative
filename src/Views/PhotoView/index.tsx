import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

import { translate } from '../../Locales';

import BackButton from '../../Components/BackButton';
import Button from '../../Components/Button';

import { Container, PageHeader, PageTitle, Image } from './styles';

interface Props {
    photoPath: string;
}

const PhotoView: React.FC<Props> = () => {
    const { params } = useRoute();
    const routeParams = params as Props;

    const { goBack } = useNavigation();

    return (
        <Container>
            <PageHeader>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{translate('View_PhotoView_PageTitle')}</PageTitle>
            </PageHeader>

            <Image source={{ uri: `file://${routeParams.photoPath}` }} />
            <Button
                text={translate('View_PhotoView_Button_Back')}
                onPress={goBack}
            />
        </Container>
    );
};

export default PhotoView;
