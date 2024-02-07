import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '@components/Button';

import { deleteSubscription } from '@teams/Functions/Team/Subscriptions/Delete';
import { getSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import { Container, Category } from '../Settings/styles';

const Test: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleToken = useCallback(async () => {
		const token = await auth().currentUser?.getIdTokenResult();

		console.log(token?.token);
	}, []);

	const deleteSub = useCallback(async () => {
		const team = await getSelectedTeam();

		if (!team) return;
		await deleteSubscription(team.userRole.team.id);
	}, []);

	const handleNavigate = useCallback(() => {
		navigate('NoInternet');
	}, [navigate]);

	return (
		<Container>
			<ScrollView>
				<Category>
					<Button title="Log user token" onPress={handleToken} />

					<Button title="Delete subscription" onPress={deleteSub} />

					<Button
						title="Navigate to noInternet"
						onPress={handleNavigate}
					/>
				</Category>
			</ScrollView>
		</Container>
	);
};

export default Test;
