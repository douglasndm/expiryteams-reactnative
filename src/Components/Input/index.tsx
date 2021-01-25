import React from 'react';
import { TextInputProps } from 'react-native';

import { Container, InputTextContainer, InputText } from './styles';

interface Props {
    hasError?: boolean;
    inputProps?: TextInputProps;
}

const Input: React.FC<Props> = ({ hasError, inputProps }: Props) => {
    return (
        <Container>
            <InputTextContainer hasError={hasError}>
                <InputText {...inputProps}>{inputProps?.value}</InputText>
            </InputTextContainer>
        </Container>
    );
};

export default Input;
