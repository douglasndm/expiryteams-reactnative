import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Home from '~/Views/Home';
import AddProduct from '~/Views/Product/Add';
import AddBatch from '~/Views/Batch/Add';
import EditProduct from '~/Views/Product/Edit';
import EditBatch from '~/Views/Batch/Edit';
import ProductDetails from '~/Views/Product/Details';
import Settings from '~/Views/Settings';
import About from '~/Views/About';
import Error from '~/Views/Informations/Error';
import PhotoView from '~/Views/PhotoView';

import BatchView from '~/Views/Batch/View';
import BatchDiscount from '~/Views/Batch/Discount';

import User from '~/Views/User';
import Logout from '~/Views/Auth/Logout';

import ListCategory from '~/Views/Category/List';
import CategoryView from '~/Views/Category/View';
import CategoryEdit from '~/Views/Category/Edit';

import Export from '~/Views/Export';

import TeamList from '~/Views/Team/List';

// Team managerment
import EnterTeam from '~/Views/Team/EnterTeam';
import CreateTeam from '~/Views/Team/Add';
import EditTeam from '~/Views/Team/Edit';
import ViewTeam from '~/Views/Team/View';
import ListUsers from '~/Views/Team/Manager/ListUsers';
import UserDetails from '~/Views/Team/Manager/UserDetails';

import VerifyEmail from '~/Views/Auth/VerifyEmail';

import DeleteTeam from '~/Views/Informations/Delete/Team';
import DeleteUser from '~/Views/Informations/Delete/User';

import Subscription from '~/Views/Subscription';

import Test from '~/Views/Test';

const Stack = createNativeStackNavigator<RoutesParams>();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddProduct" component={AddProduct} />

            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="AddBatch" component={AddBatch} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="EditBatch" component={EditBatch} />
            <Stack.Screen name="Error" component={Error} />
            <Stack.Screen name="PhotoView" component={PhotoView} />

            <Stack.Screen name="BatchView" component={BatchView} />
            <Stack.Screen name="BatchDiscount" component={BatchDiscount} />

            <Stack.Screen name="ListCategory" component={ListCategory} />
            <Stack.Screen name="CategoryView" component={CategoryView} />
            <Stack.Screen name="CategoryEdit" component={CategoryEdit} />

            <Stack.Screen name="User" component={User} />

            <Stack.Screen name="Logout" component={Logout} />

            <Stack.Screen name="Export" component={Export} />

            <Stack.Screen name="TeamList" component={TeamList} />

            <Stack.Screen name="CreateTeam" component={CreateTeam} />
            <Stack.Screen name="EnterTeam" component={EnterTeam} />

            <Stack.Screen name="ViewTeam" component={ViewTeam} />
            <Stack.Screen name="EditTeam" component={EditTeam} />
            <Stack.Screen name="ListUsersFromTeam" component={ListUsers} />
            <Stack.Screen name="UserDetails" component={UserDetails} />

            <Stack.Screen name="Subscription" component={Subscription} />

            <Stack.Screen name="DeleteTeam" component={DeleteTeam} />
            <Stack.Screen name="DeleteUser" component={DeleteUser} />

            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />

            <Stack.Screen name="Test" component={Test} />
        </Stack.Navigator>
    );
};

export default Routes;
