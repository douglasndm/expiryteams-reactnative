import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;

export const CategoryTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin: 5px 10px;
    color: ${(props) => props.theme.colors.text};
`;
