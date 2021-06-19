import React from 'react';
import { ViewStyle } from 'react-native';

import { ButtonContainer, BackButtonImage } from './styles';

interface RequestProps {
    handleOnPress?: () => void;
    contentStyle?: ViewStyle;
}

const BackButton: React.FC<RequestProps> = ({
    handleOnPress,
    contentStyle,
}: RequestProps) => {
    return (
        <ButtonContainer
            onPress={handleOnPress}
            style={contentStyle}
            rippleColor="red"
        >
            <BackButtonImage />
        </ButtonContainer>
    );
};

export default BackButton;
