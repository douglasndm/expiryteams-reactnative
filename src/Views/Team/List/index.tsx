import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { getUserTeams } from '@teams/Functions/Team/Users';
import { setSelectedTeam } from '@teams/Functions/Team/SelectedTeam';
import { getTeamPreferences } from '@teams/Functions/Team/Preferences';

import Loading from '@components/Loading';
import Button from '@components/Button';
import Header from '@components/Header';

import {
	Container,
	Content,
	EmptyText,
	ListTeamsTitle,
	TeamItemContainer,
	TeamItemTitle,
	TeamItemRole,
	Footer,
} from './styles';

const List: React.FC = () => {
	const { navigate, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();
	const teamContext = useTeam();

	const [isMounted, setIsMounted] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const [team, setTeam] = useState<IUserRoles | null>(null);

	const loadData = useCallback(async () => {
		if (!isMounted) return;
		try {
			setIsLoading(true);

			const response = await getUserTeams();

			if (response.role) {
				setTeam(response.role);
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, [isMounted]);

	const role = useMemo(() => {
		if (team && team.role) {
			const userRole = team.role.toLowerCase();

			if (userRole === 'manager') {
				return strings.UserInfo_Role_Manager.toLowerCase();
			}
			if (userRole === 'supervisor') {
				return strings.UserInfo_Role_Supervisor.toLowerCase();
			}
			if (userRole === 'repositor') {
				return strings.UserInfo_Role_Repositor.toLowerCase();
			}
		}

		return strings.UserInfo_Role_Repositor.toLowerCase();
	}, [team]);

	const status = useMemo(() => {
		if (team) {
			if (team.role.toLowerCase() === 'manager') {
				return 'completed';
			}
			if (!!team.status) {
				return team.status.toLowerCase();
			}
		}

		return 'pending';
	}, [team]);

	const isPending = useMemo(() => {
		if (team) {
			if (status) {
				if (status === 'completed') {
					return false;
				}
			}

			if (role && role === 'manager') {
				return false;
			}
		}

		return true;
	}, [role, status, team]);

	const isActive = useMemo(() => {
		if (team) {
			const { subscriptions: sub } = team.team;

			if (sub && sub.length > 0) {
				return sub[0].isActive;
			}
		}

		return false;
	}, [team]);

	const handleNavigateCreateTeam = useCallback(() => {
		navigate('CreateTeam');
	}, [navigate]);

	const handleSettings = useCallback(() => {
		navigate('Settings');
	}, [navigate]);

	useEffect(() => {
		loadData();

		return () => setIsMounted(false);
	}, []);

	const handleSelectTeam = useCallback(async () => {
		if (!team) return;

		const { subscriptions: sub } = team.team;

		if (sub && sub.length > 0) {
			if (sub[0].isActive !== true) {
				if (role !== 'manager') {
					showMessage({
						message:
							strings.View_TeamList_Error_ManagerShouldActiveTeam,
						type: 'warning',
					});
					return;
				}
			}
		}

		if (team.team) {
			if (role !== 'manager' && status === 'pending') {
				reset({
					routes: [
						{
							name: 'Routes',
							state: {
								routes: [
									{
										name: 'ListTeam',
									},
									{
										name: 'EnterTeam',
										params: { userRole: team },
									},
								],
							},
						},
					],
				});
				return;
			}

			const teamPreferences = await getTeamPreferences({
				team_id: team.team.id,
			});

			const activeSub = sub && sub.length > 0 && sub[0].isActive;

			await setSelectedTeam({
				userRole: {
					...team,
					team: {
						...team.team,
						isActive: activeSub || false,
					},
				},
				teamPreferences,
			});

			if (teamContext.reload) {
				teamContext.reload();
			} else {
				return;
			}

			reset({
				routes: [
					{
						name: 'Routes',
						state: {
							routes: [
								{
									name: 'Home',
								},
							],
						},
					},
				],
			});
		}
	}, [reset, role, status, team, teamContext]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header title={strings.View_TeamList_PageTitle} noDrawer />

			<Content>
				{!team && (
					<EmptyText>{strings.View_TeamList_EmptyTeamList}</EmptyText>
				)}

				{team && (
					<>
						<ListTeamsTitle>
							{strings.View_TeamList_ListTitle}
						</ListTeamsTitle>
						<TeamItemContainer
							isPending={isPending || !isActive}
							onPress={handleSelectTeam}
						>
							<TeamItemTitle>
								{team?.team.name || ''}
							</TeamItemTitle>
							<TeamItemRole>
								{isPending
									? status.toUpperCase()
									: role.toUpperCase()}
							</TeamItemRole>
						</TeamItemContainer>
					</>
				)}
			</Content>

			<Footer>
				{!team && (
					<Button
						text={strings.View_TeamList_Button_CreateTeam}
						onPress={handleNavigateCreateTeam}
						contentStyle={{ width: 150, marginBottom: 0 }}
					/>
				)}

				<Button
					text={strings.View_TeamList_Button_Settings}
					onPress={handleSettings}
					contentStyle={{ width: 150 }}
				/>
			</Footer>
		</Container>
	);
};

export default memo(List);
