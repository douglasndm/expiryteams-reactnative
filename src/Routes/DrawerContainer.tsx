import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PreferencesContext from '~/Contexts/PreferencesContext';

import DrawerMenu from '../Components/DrawerMenu';

import Routes from './Routes';
import RoutesAuth from './Routes.auth';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    return !!userPreferences.user && !!userPreferences.selectedTeam ? (
        <Drawer.Navigator
            drawerType="slide"
            openByDefault={false}
            keyboardDismissMode="on-drag"
            initialRouteName="Home"
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name="HomePage" component={Routes} />
        </Drawer.Navigator>
    ) : (
        <RoutesAuth />
    );
};

export default DrawerContainer;
