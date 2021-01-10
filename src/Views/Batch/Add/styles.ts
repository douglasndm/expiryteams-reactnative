import styled from 'styled-components/native';

export const ProductHeader = styled.View`
    margin: -5px 6px 10px 6px;
`;

export const ProductName = styled.Text`
    font-size: 34px;

    color: ${(props) => props.theme.colors.text};
`;

export const ProductCode = styled.Text`
    font-size: 18px;

    color: ${(props) => props.theme.colors.text};
`;
