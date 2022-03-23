import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs(() => ({
    contentContainerStyle: { flexGrow: 1 },
}))`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    margin-top: 15px;
    flex: 1;
`;

export const InputGroup = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px 10px;
`;

export const InputTextTip = styled.Text`
    color: red;
    margin: -5px 10px 5px;
`;
