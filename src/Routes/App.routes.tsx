import React, { useCallback, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabMenu from '@components/TabMenu';

import Home from '@teams/Views/Home';
import AddProduct from '@teams/Views/Product/Add';
import AddBatch from '@teams/Views/Batch/Add';
import EditProduct from '@teams/Views/Product/Edit';
import EditBatch from '@teams/Views/Batch/Edit';
import ProductDetails from '@teams/Views/Product/Details';
import Settings from '@teams/Views/Settings';
import About from '@teams/Views/About';
import Error from '@teams/Views/Informations/Error';
import PhotoView from '@views/Product/PhotoView';

import BatchView from '@teams/Views/Batch/View';
import BatchDiscount from '@teams/Views/Batch/Discount';

import User from '@teams/Views/User';
import Logout from '@teams/Views/Auth/Logout';

import ListCategory from '@teams/Views/Category/List';
import CategoryView from '@teams/Views/Category/View';
import CategoryEdit from '@teams/Views/Category/Edit';

import BrandList from '@teams/Views/Brand/List';
import BrandView from '@teams/Views/Brand/View';
import BrandEdit from '@teams/Views/Brand/Edit';

import StoreList from '@teams/Views/Stores/List';
import StoreView from '@teams/Views/Stores/View';
import StoreEdit from '@teams/Views/Stores/Edit';

import Export from '@teams/Views/Export';

import TeamList from '@teams/Views/Team/List';

// Team management
import EnterTeam from '@teams/Views/Team/EnterTeam';
import CreateTeam from '@teams/Views/Team/Add';
import EditTeam from '@teams/Views/Team/Edit';
import ViewTeam from '@teams/Views/Team/View';
import ListUsers from '@teams/Views/Team/Manager/ListUsers';
import UserDetails from '@teams/Views/Team/Manager/UserDetails';

import Logs from '@teams/Views/Team/Management/Logs';

import VerifyEmail from '@teams/Views/Account/VerifyEmail';

import DeleteTeam from '@teams/Views/Informations/Delete/Team';
import DeleteUser from '@teams/Views/Informations/Delete/User';

import Test from '@teams/Views/Test';

const Stack = createNativeStackNavigator<RoutesParams>();

const Routes: React.FC = () => {
	const [currentRoute, setCurrentRoute] = useState('Home');

	const enableTabBar = remoteConfig().getValue('enable_app_bar');

	const handleRouteChange = useCallback(navRoutes => {
		if (navRoutes) {
			const { routes } = navRoutes.data.state;

			setCurrentRoute(routes[routes.length - 1].name);
		}
	}, []);

	return (
		<>
			<Stack.Navigator
				screenOptions={{ headerShown: false }}
				screenListeners={{ state: handleRouteChange }}
			>
				<Stack.Screen name="Home" component={Home} />
				<Stack.Screen name="AddProduct" component={AddProduct} />

				<Stack.Screen name="Settings" component={Settings} />
				<Stack.Screen name="About" component={About} />
				<Stack.Screen
					name="ProductDetails"
					component={ProductDetails}
				/>
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

				<Stack.Screen name="BrandList" component={BrandList} />
				<Stack.Screen name="BrandView" component={BrandView} />
				<Stack.Screen name="BrandEdit" component={BrandEdit} />

				<Stack.Screen name="StoreList" component={StoreList} />
				<Stack.Screen name="StoreView" component={StoreView} />
				<Stack.Screen name="StoreEdit" component={StoreEdit} />

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

				<Stack.Screen name="TeamLogs" component={Logs} />

				<Stack.Screen name="DeleteTeam" component={DeleteTeam} />
				<Stack.Screen name="DeleteUser" component={DeleteUser} />

				<Stack.Screen name="VerifyEmail" component={VerifyEmail} />

				<Stack.Screen name="Test" component={Test} />
			</Stack.Navigator>

			{enableTabBar.asBoolean() === true && (
				<TabMenu
					currentRoute={currentRoute}
					enableMultiplesStores={false}
				/>
			)}
		</>
	);
};

export default Routes;
