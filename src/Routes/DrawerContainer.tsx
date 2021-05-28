import React, { useContext, useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PreferencesContext from '~/Contexts/PreferencesContext';

import DrawerMenu from '../Components/DrawerMenu';

import Routes from './Routes';
import RoutesAuth from './Routes.auth';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const renderAuthRoutes = useMemo(() => {
        if (!userPreferences.user) {
            return true;
        }

        if (!userPreferences.selectedTeam) {
            return true;
        }

        if (!userPreferences.selectedTeam.team.id) {
            return true;
        }
        return false;
    }, [userPreferences.selectedTeam, userPreferences.user]);

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
