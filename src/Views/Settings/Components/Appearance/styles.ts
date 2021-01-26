import styled from 'styled-components/native';

export const Text = styled.Text`
    color: ${(props) => props.theme.colors.text};
`;

export const PickerContainer = styled.View`
    margin-top: 10px;
    justify-content: space-between;
`;
