import React, { useState, useCallback } from 'react';

import { Container, Input, Icon } from './styles';

interface Props {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    hasError?: boolean;
    isPassword?: boolean;
}

const InputText: React.FC<Props> = ({
    value,
    placeholder,
    onChange,
    hasError,
    isPassword,
}: Props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSwitchShowPassword = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    return (
        <Container hasError={hasError}>
            <Input
                value={value}
                placeholder={placeholder}
                onChangeText={onChange}
                secureTextEntry={isPassword && !showPassword}
            />
            {isPassword && (
                <Icon
                    name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
                    onPress={handleSwitchShowPassword}
                />
            )}
        </Container>
    );
};

export default InputText;
