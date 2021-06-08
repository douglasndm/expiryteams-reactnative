import styled from 'styled-components/native';

export const ProductHeader = styled.View`
    margin: 0 5px 7px;
    flex: 1.5;
`;

export const ProductName = styled.Text`
    font-size: 32px;

    color: ${props => props.theme.colors.text};
`;

export const ProductCode = styled.Text`
    font-size: 18px;

    color: ${props => props.theme.colors.text};
`;
