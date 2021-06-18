import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Home from '~/Views/Home';
import AddProduct from '~/Views/Product/Add';
import AddLote from '~/Views/Batch/Add';
import EditProduct from '~/Views/Product/Edit';
import EditLote from '~/Views/Batch/Edit';
import ProductDetails from '~/Views/ProductDetails';
import Settings from '~/Views/Settings';
import About from '~/Views/About';
import Success from '~/Views/Informations/Success';
import Error from '~/Views/Informations/Error';
import PhotoView from '~/Views/PhotoView';

import User from '~/Views/User';

import ListCategory from '~/Views/Category/List';
import CategoryView from '~/Views/Category/View';
import CategoryEdit from '~/Views/Category/Edit';

import Export from '~/Views/Export';

import TeamList from '~/Views/Team/List';

// Team managerment
import CreateTeam from '~/Views/Team/Add';
import ViewTeam from '~/Views/Team/View';
import ListUsers from '~/Views/Team/Manager/ListUsers';
import UserDetails from '~/Views/Team/Manager/UserDetails';

import Subscription from '~/Views/Subscription';

import Test from '~/Views/Test';

const Stack = createNativeStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddProduct" component={AddProduct} />

            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="AddLote" component={AddLote} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="EditLote" component={EditLote} />
            <Stack.Screen name="Success" component={Success} />
            <Stack.Screen name="Error" component={Error} />
            <Stack.Screen name="PhotoView" component={PhotoView} />

            <Stack.Screen name="ListCategory" component={ListCategory} />
            <Stack.Screen name="CategoryView" component={CategoryView} />
            <Stack.Screen name="CategoryEdit" component={CategoryEdit} />

            <Stack.Screen name="User" component={User} />

            <Stack.Screen name="Export" component={Export} />

            <Stack.Screen name="TeamList" component={TeamList} />

            <Stack.Screen name="CreateTeam" component={CreateTeam} />
            <Stack.Screen name="ViewTeam" component={ViewTeam} />
            <Stack.Screen name="ListUsersFromTeam" component={ListUsers} />
            <Stack.Screen name="UserDetails" component={UserDetails} />

            <Stack.Screen name="Subscription" component={Subscription} />

            <Stack.Screen name="Test" component={Test} />
        </Stack.Navigator>
    );
};

export default Routes;
