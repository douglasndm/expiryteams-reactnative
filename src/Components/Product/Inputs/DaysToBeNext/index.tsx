import React, { useCallback, useState } from 'react';

import strings from '~/Locales';

import {
    Container,
    TextDescription,
    InputTextContainer,
    InputText,
} from './styles';

interface Props {
    onChange: (value: number) => void;
}

const DaysToBeNext: React.FC<Props> = ({ onChange }: Props) => {
    const [days, setDays] = useState<string | undefined>();

    const onTextChange = useCallback(
        (value: string) => {
            const regex = /^[0-9\b]+$/;

            if (value === '' || regex.test(value)) {
                setDays(value);
                onChange(Number(value));
            }
        },
        [onChange]
    );

    return (
        <>
            <TextDescription>
                {strings.Component_DaysToBeNext_Description}
            </TextDescription>
            <Container>
                <InputTextContainer>
                    <InputText
                        placeholder={strings.Component_DaysToBeNext_Placeholder}
                        value={days}
                        onChangeText={onTextChange}
                    />
                </InputTextContainer>
            </Container>
        </>
    );
};

export default DaysToBeNext;
