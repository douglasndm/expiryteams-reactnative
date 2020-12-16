import React from 'react';

import { Button, ButtonText, Loading } from './styles';

interface Request {
    text: string;
    accessibilityLabel?: string;
    isLoading?: boolean;
    onPress: () => void;
}

const GenericButton: React.FC<Request> = ({
    text,
    accessibilityLabel = '',
    isLoading = false,
    onPress,
}: Request) => (
    <Button onPress={onPress} accessibilityLabel={accessibilityLabel}>
        {isLoading ? <Loading /> : <ButtonText>{text}</ButtonText>}
    </Button>
);

export default GenericButton;
