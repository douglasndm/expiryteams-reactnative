import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	getTeamPreferences,
	updateTeamPreferences,
} from '@teams/Functions/Team/Preferences';
import {
	getSelectedTeam,
	setSelectedTeam,
	clearSelectedteam,
} from '@teams/Functions/Team/SelectedTeam';
import { removeItSelfFromTeam } from '@teams/Functions/Team/User/Remove';

import Button from '@components/Button';

import { Section, SectionTitle, SubscriptionDescription } from '../../styles';

import {
	LoadingIndicator,
	OptionContainer,
	ButtonPaper,
	Icons,
	CheckBox,
} from './styles';

const Advenced: React.FC = () => {
	const { navigate, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const isManager = useMemo(() => {
		if (teamContext.id) {
			if (teamContext.roleInTeam?.role.toLowerCase() === 'manager') {
				return true;
			}
		}
		return false;
	}, [teamContext.id, teamContext.roleInTeam]);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isQuiting, setIsQuiting] = useState<boolean>(false);
	const [allowProduct, setAllowProduct] = useState<boolean>(false);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			setIsLoading(true);

			const prefes = await getTeamPreferences({
				team_id: teamContext.id,
			});

			if (prefes.allowCollectProduct) {
				setAllowProduct(prefes.allowCollectProduct);
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [teamContext.id]);

	const updatePreferences = useCallback(
		async (allowProd: boolean) => {
			if (!teamContext.id) return;
			try {
				setIsLoading(true);

				const response = await updateTeamPreferences({
					team_id: teamContext.id,
					preferences: {
						allowCollectProduct: allowProd,
					},
				});

				if (response.allowCollectProduct !== undefined) {
					setAllowProduct(response.allowCollectProduct);

					const selectedTeam = await getSelectedTeam();

					if (selectedTeam)
						await setSelectedTeam({
							userRole: selectedTeam.userRole,
							teamPreferences: {
								...selectedTeam.teamPreferences,
								allowCollectProduct:
									response.allowCollectProduct,
							},
						});

					if (teamContext.reload) teamContext.reload();
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
		},
		[teamContext]
	);

	const handleSwitchAllowProd = useCallback(async () => {
		const newValue = !allowProduct;

		await updatePreferences(newValue);
		setAllowProduct(newValue);
	}, [allowProduct, updatePreferences]);

	const handleDeleteTeam = useCallback(async () => {
		navigate('DeleteTeam');
	}, [navigate]);

	useEffect(() => {
		loadData();
	}, []);

	const quitTeam = useCallback(async () => {
		if (!teamContext.id) return;

		try {
			setIsQuiting(true);
			await removeItSelfFromTeam({ team_id: teamContext.id });

			if (teamContext.clearTeam) {
				teamContext.clearTeam();
				await clearSelectedteam();
				reset({
					routes: [{ name: 'TeamList' }],
				});
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					type: 'danger',
					message: err.message,
				});
			}
		} finally {
			setIsQuiting(false);
		}
	}, [reset, teamContext]);
	return (
		<Section>
			<SectionTitle>{strings.View_TeamView_Advanced_Title}</SectionTitle>

			<SubscriptionDescription>
				{strings.View_TeamView_Advanced_Description}
			</SubscriptionDescription>

			{!isManager && (
				<>
					{isQuiting ? (
						<LoadingIndicator />
					) : (
						<Button
							text={strings.View_TeamView_Button_QuitTeam}
							onPress={quitTeam}
							contentStyle={{ width: 135 }}
						/>
					)}
				</>
			)}

			{isLoading ? (
				<LoadingIndicator />
			) : (
				<>
					{isManager && (
						<CheckBox
							isChecked={allowProduct}
							onPress={handleSwitchAllowProd}
							disableBuiltInState
							bounceFriction={10}
							style={{ marginTop: 15 }}
							text={
								strings.View_TeamView_Advanced_AllowProductsDataCollect
							}
						/>
					)}
				</>
			)}

			{isManager && (
				<OptionContainer>
					<ButtonPaper
						icon={() => <Icons name="trash-outline" size={22} />}
						onPress={handleDeleteTeam}
					>
						{strings.View_TeamView_Advanced_Button_DeleteTeam}
					</ButtonPaper>
				</OptionContainer>
			)}
		</Section>
	);
};

export default React.memo(Advenced);
