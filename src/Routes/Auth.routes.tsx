import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Intro from '@teams/Views/Informations/Intro';
import Login from '@teams/Views/Auth/Login';
import ForgotPassword from '@teams/Views/Auth/ForgotPassword';
import CreateAccount from '@teams/Views/Auth/CreateAccount';

const Stack = createNativeStackNavigator();

const Routes: React.FC = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Intro" component={Intro} />
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
			<Stack.Screen name="CreateAccount" component={CreateAccount} />
		</Stack.Navigator>
	);
};

export default Routes;
