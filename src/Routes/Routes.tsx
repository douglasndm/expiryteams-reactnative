import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '~/Views/Home';
import AddProduct from '~/Views/Product/Add';
import AddLote from '~/Views/Batch/Add';
import EditProduct from '~/Views/Product/Edit';
import EditLote from '~/Views/Batch/Edit';
import ProductDetails from '~/Views/ProductDetails';
import AllProducts from '~/Views/AllProducts';
import AllProductsByStore from '~/Views/AllProductsByStore';
import StoreDetails from '~/Views/StoreDetails';
import Settings from '~/Views/Settings';
import About from '~/Views/About';
import ProSubscription from '~/Views/ProSubscription';
import ProOfferings from '~/Views/ProSubscription/Offerings';
import Success from '~/Views/Success';
import PhotoView from '~/Views/PhotoView';
import ListCategory from '~/Views/Category/List';
import CategoryView from '~/Views/Category/View';

import SignIn from '~/Views/Auth/SignIn';

import Test from '~/Views/Test';

const Stack = createStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="ListCategory" component={ListCategory} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="AllProducts" component={AllProducts} />
            <Stack.Screen
                name="AllProductsByStore"
                component={AllProductsByStore}
            />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="StoreDetails" component={StoreDetails} />
            <Stack.Screen name="AddLote" component={AddLote} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="EditLote" component={EditLote} />
            <Stack.Screen name="Test" component={Test} />
            <Stack.Screen name="Pro" component={ProSubscription} />
            <Stack.Screen name="Success" component={Success} />
            <Stack.Screen name="PhotoView" component={PhotoView} />

            <Stack.Screen name="CategoryView" component={CategoryView} />

            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="ProOfferings" component={ProOfferings} />
        </Stack.Navigator>
    );
};

export default Routes;
