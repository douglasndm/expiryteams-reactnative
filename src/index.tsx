import 'react-native-gesture-handler';
import CodePush, { CodePushOptions } from 'react-native-code-push';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LogBox, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import {
	NavigationContainer,
	getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import Analyticts from '@react-native-firebase/analytics';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from 'react-native-flash-message';
import screens from 'react-native-screens';

import StatusBar from '@components/StatusBar';

import './Locales';

import './Services/LogRocket';
import './Services/Analytics';
import './Services/RemoteConfig';
import DeepLinking from './Services/DeepLinking';

import './Functions/Team/Subscriptions';
import './Functions/PushNotifications';
import { getAllUserPreferences } from './Functions/UserPreferences';

import Routes from './Routes/DrawerContainer';

import PreferencesContext from './Contexts/PreferencesContext';
import DefaultPrefs from './Contexts/DefaultPreferences';
import { AuthProvider } from './Contexts/AuthContext';
import { TeamProvider } from './Contexts/TeamContext';

import { navigationRef } from './References/Navigation';

import AskReview from './Components/AskReview';

LogBox.ignoreLogs(['new NativeEventEmitter', 'EventEmitter.removeListener']); // Ignore log notification by message

screens.enableScreens(true);

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [previousRoute, setPreviousRoute] = useState('Home');

	const [preferences, setPreferences] =
		useState<IUserPreferences>(DefaultPrefs);

	const loadInitialData = useCallback(async () => {
		const prefs = await getAllUserPreferences();

		setPreferences(prefs);

		setIsLoading(false);

		SplashScreen.hide();
	}, []);

	const handleOnScreenChange = useCallback(
		async state => {
			const route = state.routes[0] || 'undefined';
			const focusedRouteName = getFocusedRouteNameFromRoute(route);

			if (focusedRouteName) {
				if (previousRoute !== focusedRouteName) {
					setPreviousRoute(focusedRouteName);

					if (!__DEV__) {
						await Analyticts().logScreenView({
							screen_name: focusedRouteName,
							screen_class: focusedRouteName,
						});
					}
				}
			}
		},
		[previousRoute]
	);

	useEffect(() => {
		loadInitialData();
	}, []);

	const prefes = useMemo(
		() => ({
			preferences,
			setPreferences,
		}),
		[preferences]
	);

	return isLoading ? (
		<ActivityIndicator size="large" />
	) : (
		<PreferencesContext.Provider value={prefes}>
			<ThemeProvider theme={preferences.appTheme}>
				<PaperProvider>
					<NavigationContainer
						ref={navigationRef}
						linking={DeepLinking}
						onStateChange={handleOnScreenChange}
					>
						<AuthProvider>
							<TeamProvider>
								<StatusBar />
								<Routes />

								<AskReview />
							</TeamProvider>
						</AuthProvider>
					</NavigationContainer>
					<FlashMessage duration={7000} statusBarHeight={50} />
				</PaperProvider>
			</ThemeProvider>
		</PreferencesContext.Provider>
	);
};

const codePushOptions: CodePushOptions = {
	checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
	mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
