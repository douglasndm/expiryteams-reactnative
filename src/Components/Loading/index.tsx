import React from 'react';

import { translate } from '../../Locales';

import StatusBar from '../StatusBar';

import { Container, LoadingIndicator, LoadingText } from './styles';

const Loading: React.FC = () => {
    return (
        <Container>
            <StatusBar />
            <LoadingIndicator />
            <LoadingText>{translate('LoadingComponent_Text')}</LoadingText>
        </Container>
    );
};

export default Loading;
