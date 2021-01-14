import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
    justify-content: center;
`;

export const SuccessMessageContainer = styled.View`
    flex-direction: column;
    align-items: center;
`;

export const Title = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 24px;
    font-weight: bold;
`;

export const Description = styled.Text`
    color: ${(props) => props.theme.colors.subText};
    font-size: 16px;
`;

export const ButtonContainer = styled.View`
    flex-direction: row;
`;
