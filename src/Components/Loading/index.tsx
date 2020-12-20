import React from 'react';

import { translate } from '../../Locales';

import { Container, LoadingIndicator, LoadingText } from './styles';

const Loading: React.FC = () => {
    return (
        <Container>
            <LoadingIndicator />
            <LoadingText>{translate('LoadingComponent_Text')}</LoadingText>
        </Container>
    );
};

export default Loading;
