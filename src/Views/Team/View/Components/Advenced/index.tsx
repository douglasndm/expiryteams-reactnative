import React, { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';
import { removeItSelfFromTeam } from '@teams/Functions/Team/User/Remove';

import Button from '@components/Button';

import { Section, SectionTitle, SubscriptionDescription } from '../../styles';

import {
	LoadingIndicator,
	OptionContainer,
	ButtonPaper,
	Icons,
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

	const [isQuiting, setIsQuiting] = useState<boolean>(false);

	const handleDeleteTeam = useCallback(() => {
		navigate('DeleteTeam');
	}, [navigate]);

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
