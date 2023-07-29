import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import Header from '@components/Header';
import Button from '@components/Button';
import PaddingComponent from '@components/PaddingComponent';

import Subscriptions from './Components/Subscriptions';
import Advenced from './Components/Advenced';

import {
	Container,
	PageHeader,
	PageTitle,
	PageContent,
	Section,
	SectionTitle,
	SubscriptionDescription,
	TeamName,
	ActionsButtonContainer,
	ButtonPaper,
	Icons,
	TeamHeaderContainer,
} from './styles';

const ViewTeam: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const isManager = useMemo(() => {
		if (teamContext.id) {
			if (teamContext.roleInTeam?.role.toLowerCase() === 'manager') {
				return true;
			}
		}
		return false;
	}, [teamContext.id, teamContext.roleInTeam]);

	const handleNavigateToMembers = useCallback(() => {
		navigate('ListUsersFromTeam');
	}, [navigate]);

	const handleNavigateEditTeam = useCallback(() => {
		navigate('EditTeam');
	}, [navigate]);

	const handleNavigateTeams = useCallback(() => {
		navigate('TeamList');
	}, [navigate]);

	const handleNavigateToSettings = useCallback(() => {
		navigate('Settings');
	}, [navigate]);

	return (
		<Container>
			{teamContext.active ? (
				<Header
					title={strings.View_TeamView_PageTitle}
					noDrawer
					appBarActions={
						isManager
							? [
									{
										icon: 'square-edit-outline',
										onPress: handleNavigateEditTeam,
									},
							  ]
							: []
					}
				/>
			) : (
				<PageHeader>
					<PageTitle>{strings.View_TeamView_PageTitle}</PageTitle>
				</PageHeader>
			)}

			<PageContent>
				<TeamHeaderContainer>
					{!!teamContext.name && (
						<TeamName>{teamContext.name}</TeamName>
					)}

					{!teamContext.active && (
						<ActionsButtonContainer>
							<ButtonPaper
								icon={() => (
									<Icons name="list-outline" size={22} />
								)}
								onPress={handleNavigateTeams}
							>
								{strings.View_TeamView_ActionButton_Change}
							</ButtonPaper>
						</ActionsButtonContainer>
					)}
				</TeamHeaderContainer>

				{isManager && <Subscriptions />}

				{teamContext.active && (
					<Section>
						<SectionTitle>
							{strings.View_TeamView_Members_Title}
						</SectionTitle>

						<SubscriptionDescription>
							{strings.View_TeamView_Members_Description}
						</SubscriptionDescription>

						<Button
							text={strings.View_TeamView_Button_GoToMembers}
							onPress={handleNavigateToMembers}
						/>
					</Section>
				)}

				<Advenced />

				{!teamContext.active && (
					<Button
						text={strings.View_TeamView_Button_GoToSettings}
						onPress={handleNavigateToSettings}
					/>
				)}

				<PaddingComponent />
			</PageContent>
		</Container>
	);
};

export default ViewTeam;
