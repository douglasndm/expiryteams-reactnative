import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';

export const PickerContainer = styled.View`
    justify-content: space-between;

    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    background-color: ${({ theme }) => theme.colors.inputBackground};

    padding: 5px;
    font-size: 18px;

    ${Platform.OS === 'ios' &&
    css`
        padding: 17px 10px;
    `}
`;

export const Picker = styled(RNPickerSelect).attrs(({ theme }) => ({
    pickerProps: {
        style: {
            color: theme.colors.text,
        },
    },
    textInputProps: {
        style: {
            color: theme.colors.text,
        },
    },
}))``;
