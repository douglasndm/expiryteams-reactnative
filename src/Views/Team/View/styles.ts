import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { DataTable } from 'react-native-paper';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
    margin-top: ${Platform.OS === 'ios' ? 0 : 15}px;
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
    padding: 15px 16px 0 16px;
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

export const SubscriptionPrice = styled.Text`
    margin-top: 10px;
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    text-align: center;
    font-weight: bold;
`;

export const SubscriptionContainer = styled.View`
    margin: 10px 0 0 0;
`;

export const SubscriptionTableTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 21px;
`;

export const SubscriptionsTable = styled(DataTable)``;

export const SubscriptionExpDate = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
`;

export const SubscriptionLimit = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Open Sans';
`;
