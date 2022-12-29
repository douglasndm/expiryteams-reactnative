import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '@components/Button';

import strings from '@teams/Locales';
import { Category, CategoryOptions, CategoryTitle } from '../../styles';

const Account: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleLogout = useCallback(() => {
		navigate('Logout');
	}, [navigate]);

	const handleNavigateDelete = useCallback(() => {
		navigate('DeleteUser');
	}, [navigate]);

	return (
		<Category>
			<CategoryTitle>Conta</CategoryTitle>

			<CategoryOptions>
				<Button
					text={strings.View_Settings_Button_SignOut}
					onPress={handleLogout}
					contentStyle={{ width: 135 }}
				/>

				<Button
					text={strings.View_Settings_Button_DeleteAccount}
					onPress={handleNavigateDelete}
					contentStyle={{
						width: 135,
						marginTop: 0,
						backgroundColor: '#b00c17',
					}}
				/>
			</CategoryOptions>
		</Category>
	);
};

export default Account;
