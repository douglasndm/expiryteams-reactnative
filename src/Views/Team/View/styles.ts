import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { DataTable } from 'react-native-paper';

export const Container = styled.ScrollView`
    flex: 1;
    padding: ${Platform.OS === 'ios' ? 50 : 16}px 0 5px;
    background-color: ${props => props.theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

export const TeamName = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    font-size: 23px;
    font-weight: bold;
    margin: 0 0 15px;
`;

export const PageContent = styled.View`
    padding: 15px 16px 100px;
`;

export const Section = styled.View`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 20px 15px;
    border-radius: 12px;
    margin-bottom: 15px;
`;

export const SectionTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    font-size: 21px;
    font-weight: bold;
`;

export const SubscriptionDescription = styled.Text`
    margin-top: 10px;
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
`;

export const SubscriptionContainer = styled.View`
    margin: 10px 0 0 0;
`;

export const SubscriptionTableTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 21px;

    margin-top: 20px;
`;

export const SubscriptionsTable = styled(DataTable)``;

export const SubscriptionHeader = styled(DataTable.Title).attrs(
    ({ theme }) => ({
        theme,
    })
)``;

export const SubscriptionText = styled.Text`
    color: ${props => props.theme.colors.text};
`;
