import React from 'react';
import { ViewStyle } from 'react-native';

import { Button, ButtonText, Loading } from './styles';

interface Request {
    text: string;
    accessibilityLabel?: string;
    isLoading?: boolean;
    onPress: () => void;
    contentStyle?: ViewStyle;
}

const GenericButton: React.FC<Request> = ({
    text,
    accessibilityLabel = '',
    isLoading = false,
    onPress,
    contentStyle,
}: Request) => (
    <Button
        onPress={onPress}
        enabled={!isLoading}
        accessibilityLabel={accessibilityLabel}
        style={contentStyle}
    >
        {isLoading ? <Loading /> : <ButtonText>{text}</ButtonText>}
    </Button>
);

export default GenericButton;
