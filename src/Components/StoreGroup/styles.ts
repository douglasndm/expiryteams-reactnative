import styled from 'styled-components/native';

export const StoreGroupContainer = styled.View`
    margin-bottom: 10px;
`;

export const StoreTitle = styled.Text`
    color: ${({ theme }) => theme.colors.text};
    font-size: 22px;
    font-weight: bold;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 10px;
`;

export const AdView = styled.View`
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
`;
