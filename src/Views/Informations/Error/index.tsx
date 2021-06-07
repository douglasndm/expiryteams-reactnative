import React, { useMemo } from 'react';
import LottieView from 'lottie-react-native';

import { Container, Content, ErrorTitle, ErrorDescription } from './styles';

const Error: React.FC = () => {
    const animation = useMemo(() => {
        return require('~/Assets/Animations/connection.json');
    }, []);

    return (
        <Container>
            <Content>
                <LottieView
                    source={animation}
                    autoPlay
                    style={{ width: 230, height: 230 }}
                />

                <ErrorTitle>Erro de rede</ErrorTitle>

                <ErrorDescription>
                    Verique sua conexão com a internet
                </ErrorDescription>
            </Content>
        </Container>
    );
};

export default Error;
