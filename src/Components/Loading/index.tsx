import React from 'react';

import strings from '../../Locales';

import StatusBar from '../StatusBar';

import { Container, LoadingIndicator, LoadingText } from './styles';

const Loading: React.FC = () => {
    return (
        <Container>
            <StatusBar />
            <LoadingIndicator />
            <LoadingText>{strings.LoadingComponent_Text}</LoadingText>
        </Container>
    );
};

export default Loading;
