import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import strings from '@teams/Locales';

import Button from '@components/Button';

import {
	Category,
	CategoryOptions,
	CategoryTitle,
	SettingDescription,
} from '../../styles';

const Account: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const user = useMemo(() => {
		return auth().currentUser;
	}, []);

	const handleLogout = useCallback(() => {
		navigate('Logout');
	}, [navigate]);

	const handleNavigateDelete = useCallback(() => {
		navigate('DeleteUser');
	}, [navigate]);

	return (
		<Category>
			<CategoryTitle>Conta</CategoryTitle>

			{user && (
				<SettingDescription>E-mail: {user.email}</SettingDescription>
			)}

			<CategoryOptions>
				<Button
					title={strings.View_Settings_Button_SignOut}
					onPress={handleLogout}
					contentStyle={{ width: 135 }}
				/>

				<Button
					title={strings.View_Settings_Button_DeleteAccount}
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
