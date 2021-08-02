import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    flex-direction: column;
    margin: 0 10px;
`;

export const AboutSection = styled.View`
    margin-top: 20px;
`;

export const ApplicationName = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;

export const ApplicationVersion = styled.Text`
    font-size: 14px;
    color: ${props => props.theme.colors.subText};
`;

export const Text = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 16px;
`;

export const Link = styled.Text`
    color: ${props => props.theme.colors.accent};
    font-size: 14px;
`;
