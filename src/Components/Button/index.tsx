import React from 'react';
import { ViewStyle } from 'react-native';

import { Button, ButtonText, Loading } from './styles';

interface Request {
    text: string;
    isLoading?: boolean;
    onPress: () => void;
    contentStyle?: ViewStyle;
}

const GenericButton: React.FC<Request> = ({
    text,
    isLoading = false,
    onPress,
    contentStyle,
}: Request) => (
    <Button onPress={onPress} enabled={!isLoading} style={contentStyle}>
        {isLoading ? <Loading /> : <ButtonText>{text}</ButtonText>}
    </Button>
);

export default GenericButton;
