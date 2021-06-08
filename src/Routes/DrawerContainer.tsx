import React, { useCallback } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from '../Components/DrawerMenu';

import Routes from './Routes';

import TeamList from '~/Views/Team/List';

// Auth routes
import Login from '~/Views/Auth/Login';
import ForgotPassword from '~/Views/Auth/ForgotPassword';
import CreateAccount from '~/Views/Auth/CreateAccount';
import VerifyEmail from '~/Views/Auth/VerifyEmail';

import CreateTeam from '~/Views/Team/Add';
import EnterTeam from '~/Views/Team/EnterTeam';
import Logout from '~/Views/Auth/Logout';
import Subscription from '~/Views/Subscription';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    const handleSetOptions = useCallback(({ route }) => {
        let enable = true;

        switch (route.name) {
            case 'Login':
                enable = false;
                break;
            case 'ForgotPassword':
                enable = false;
                break;
            case 'CreateAccount':
                enable = false;
                break;
            case 'VerifyEmail':
                enable = false;
                break;
            case 'EnterTeam':
                enable = false;
                break;
            case 'TeamList':
                enable = false;
                break;
            case 'Subscription':
                enable = false;
                break;
            case 'Logout':
                enable = false;
                break;
            default:
                break;
        }

        return {
            swipeEnabled: enable,
        };
    }, []);

    return (
        <Drawer.Navigator
            drawerType="slide"
            openByDefault={false}
            keyboardDismissMode="on-drag"
            initialRouteName="Home"
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen
                name="Login"
                component={Login}
                options={handleSetOptions}
            />
            <Drawer.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={handleSetOptions}
            />
            <Drawer.Screen
                name="CreateAccount"
                component={CreateAccount}
                options={handleSetOptions}
            />
            <Drawer.Screen
                name="VerifyEmail"
                component={VerifyEmail}
                options={handleSetOptions}
            />

            <Drawer.Screen
                name="CreateTeam"
                component={CreateTeam}
                options={handleSetOptions}
            />
            <Drawer.Screen
                name="EnterTeam"
                component={EnterTeam}
                options={handleSetOptions}
            />

            <Drawer.Screen
                name="TeamList"
                component={TeamList}
                options={handleSetOptions}
            />

            <Drawer.Screen
                name="Logout"
                component={Logout}
                options={handleSetOptions}
            />

            <Drawer.Screen name="Routes" component={Routes} />

            <Drawer.Screen
                name="Subscription"
                component={Subscription}
                options={handleSetOptions}
            />
        </Drawer.Navigator>
    );
};

export default DrawerContainer;
