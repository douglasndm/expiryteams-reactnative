import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import Header from '@components/Header';
import Input from '@components/InputText';
import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { editTeam } from '~/Functions/Team';
import {
	getSelectedTeam,
	setSelectedTeam,
} from '~/Functions/Team/SelectedTeam';

import Button from '@components/Button';

import { Container, Content, InputGroup, InputTextTip } from './styles';

const Edit: React.FC = () => {
	const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [isMounted, setIsMounted] = useState(true);

	const [name, setName] = useState<string>('');
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [nameError, setNameError] = useState<string>('');

	const handleUpdate = useCallback(async () => {
		if (!teamContext.id || !isMounted) {
			return;
		}
		try {
			setIsUpdating(true);

			if (!name) {
				setNameError(strings.View_TeamEdit_Alert_Error_EmptyTeamName);
				return;
			}

			await editTeam({ team_id: teamContext.id, name });

			const settedTeam = await getSelectedTeam();

			if (settedTeam) {
				await setSelectedTeam({
					...settedTeam,
					userRole: {
						...settedTeam.userRole,
						team: {
							...settedTeam.userRole.team,
							name,
						},
					},
				});

				if (teamContext.reload) {
					teamContext.reload();
				}
			}

			showMessage({
				message: strings.View_TeamEdit_Alert_Success_TeamUpdated,
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsUpdating(false);
		}
	}, [isMounted, name, pop, teamContext]);

	const handleNameChange = useCallback((value: string) => {
		setName(value);
	}, []);

	useEffect(() => {
		if (teamContext.name) {
			setName(teamContext.name);
		}
	}, [teamContext.name]);

	useEffect(() => {
		return () => setIsMounted(false);
	}, []);
	return (
		<Container>
			<Header title={strings.View_TeamEdit_PageTitle} noDrawer />

			<Content>
				<InputGroup>
					<Input
						value={name}
						onChange={handleNameChange}
						placeholder={
							strings.View_TeamEdit_Input_Placeholder_TeamName
						}
						hasError={!!nameError}
						contentStyle={{ flex: 1 }}
					/>
				</InputGroup>
				{!!nameError && <InputTextTip>{nameError}</InputTextTip>}

				<Button
					text={strings.View_TeamEdit_Button_Update}
					onPress={handleUpdate}
					isLoading={isUpdating}
				/>
			</Content>
		</Container>
	);
};

export default Edit;
