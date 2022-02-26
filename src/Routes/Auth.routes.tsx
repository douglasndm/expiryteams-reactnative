import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '~/Views/Auth/Login';
import ForgotPassword from '~/Views/Auth/ForgotPassword';
import CreateAccount from '~/Views/Auth/CreateAccount';

const Stack = createNativeStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </Stack.Navigator>
    );
};

export default Routes;
