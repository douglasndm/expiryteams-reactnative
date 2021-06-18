import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Login from '~/Views/Auth/Login';
import ForgotPassword from '~/Views/Auth/ForgotPassword';
import CreateAccount from '~/Views/Auth/CreateAccount';
import VerifyEmail from '~/Views/Auth/VerifyEmail';

import EnterTeam from '~/Views/Team/EnterTeam';
import Logout from '~/Views/Auth/Logout';

const Stack = createNativeStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />

            <Stack.Screen name="EnterTeam" component={EnterTeam} />

            <Stack.Screen name="Logout" component={Logout} />
        </Stack.Navigator>
    );
};

export default Routes;
