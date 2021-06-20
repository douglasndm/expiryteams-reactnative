import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Login from '~/Views/Auth/Login';
import ForgotPassword from '~/Views/Auth/ForgotPassword';
import CreateAccount from '~/Views/Auth/CreateAccount';
import VerifyEmail from '~/Views/Auth/VerifyEmail';

const Stack = createNativeStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        </Stack.Navigator>
    );
};

export default Routes;
