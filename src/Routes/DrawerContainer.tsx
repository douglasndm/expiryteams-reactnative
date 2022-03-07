import React, { useCallback } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from '../Components/DrawerMenu';

import AuthRoutes from './Auth.routes';
import Routes from './App.routes';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    const handleDisableDrawer = useCallback(({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

        switch (routeName) {
            case 'Subscription':
                return { swipeEnabled: false };
            case 'ViewTeam':
                return { swipeEnabled: false };
            case 'CreateTeam':
                return { swipeEnabled: false };
            case 'TeamList':
                return { swipeEnabled: false };
            case 'DeleteTeam':
                return { swipeEnabled: false };
            case 'Settings':
                return { swipeEnabled: false };
            default:
                return { swipeEnabled: true };
        }
    }, []);

    return (
        <Drawer.Navigator
            drawerType="slide"
            keyboardDismissMode="on-drag"
            screenOptions={{ headerShown: false }}
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen
                name="Auth"
                component={AuthRoutes}
                options={{ swipeEnabled: false }}
            />
            <Drawer.Screen
                name="Routes"
                component={Routes}
                options={handleDisableDrawer}
            />
        </Drawer.Navigator>
    );
};

export default DrawerContainer;
