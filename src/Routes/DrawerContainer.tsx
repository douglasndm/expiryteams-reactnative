import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { useAuth } from '~/Contexts/AuthContext';

import DrawerMenu from '../Components/DrawerMenu';

import AuthRoutes from './Auth.routes';
import Routes from './App.routes';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    const { signed } = useAuth();

    return (
        <Drawer.Navigator
            drawerType="slide"
            openByDefault={false}
            keyboardDismissMode="on-drag"
            drawerContent={props => <DrawerMenu {...props} />}
        >
            {signed ? (
                <Drawer.Screen name="Routes" component={Routes} />
            ) : (
                <Drawer.Screen
                    name="Auth"
                    component={AuthRoutes}
                    options={{ swipeEnabled: false }}
                />
            )}
        </Drawer.Navigator>
    );
};

export default DrawerContainer;
