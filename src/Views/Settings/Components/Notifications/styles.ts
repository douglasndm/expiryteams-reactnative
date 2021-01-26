import styled from 'styled-components/native';

export const Container = styled.View``;

export const SettingNotificationContainer = styled.View`
    flex-direction: column;
    margin-top: 15px;
`;

export const SettingNotificationDescription = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 10px;
`;
