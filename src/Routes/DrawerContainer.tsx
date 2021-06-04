import React, { useContext, useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PreferencesContext from '~/Contexts/PreferencesContext';

import DrawerMenu from '../Components/DrawerMenu';

import Routes from './Routes';
import RoutesAuth from './Routes.auth';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    const { preferences } = useContext(PreferencesContext);

    const renderAuthRoutes = useMemo(() => {
        if (!preferences.user) {
            return true;
        }

        if (!preferences.selectedTeam) {
            return true;
        }

        if (!preferences.selectedTeam.team.id) {
            return true;
        }
        return false;
    }, [preferences.selectedTeam, preferences.user]);

    return renderAuthRoutes ? (
        <RoutesAuth />
    ) : (
        <Drawer.Navigator
            drawerType="slide"
            openByDefault={false}
            keyboardDismissMode="on-drag"
            initialRouteName="Home"
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name="HomePage" component={Routes} />
        </Drawer.Navigator>
    );
};

export default DrawerContainer;
