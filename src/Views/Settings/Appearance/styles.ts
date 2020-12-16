import styled from 'styled-components/native';
import { Picker as ReactPicker } from '@react-native-community/picker';

export const Text = styled.Text`
    color: ${(props) => props.theme.colors.text};
`;

export const PickerContainer = styled.View`
    margin-top: 10px;
    justify-content: space-between;
`;

export const Picker = styled(ReactPicker)`
    color: ${(props) => props.theme.colors.text};
`;
