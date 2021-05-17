import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PreferencesContext from '~/Contexts/PreferencesContext';

import DrawerMenu from '../Components/DrawerMenu';

import Routes from './Routes';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    return (
        <Drawer.Navigator
            drawerType="slide"
            openByDefault={false}
            keyboardDismissMode="on-drag"
            initialRouteName="Home"
            gestureHandlerProps={{
                enabled: userPreferences.enableDrawerMenu,
            }}
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name="HomePage" component={Routes} />
        </Drawer.Navigator>
    );
};

export default DrawerContainer;
