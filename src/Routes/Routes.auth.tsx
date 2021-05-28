import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TeamList from '~/Views/Team/List';

// Auth routes
import Login from '~/Views/Auth/Login';
import ForgotPassword from '~/Views/Auth/ForgotPassword';
import CreateAccount from '~/Views/Auth/CreateAccount';
import VerifyEmail from '~/Views/Auth/VerifyEmail';

import CreateTeam from '~/Views/Team/Add';
import EnterTeam from '~/Views/Team/EnterTeam';
import Logout from '~/Views/Auth/Logout';

const Stack = createStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />

            <Stack.Screen name="CreateTeam" component={CreateTeam} />
            <Stack.Screen name="EnterTeam" component={EnterTeam} />

            <Stack.Screen name="TeamList" component={TeamList} />

            <Stack.Screen name="Logout" component={Logout} />
        </Stack.Navigator>
    );
};

export default Routes;
