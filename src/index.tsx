import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import {
	NavigationContainer,
	getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import Analyticts from '@react-native-firebase/analytics';
import FlashMessage from 'react-native-flash-message';
import screens from 'react-native-screens';
import CodePush from 'react-native-code-push';

import StatusBar from '@components/StatusBar';
import AskReview from '@components/AskReview';

import '@teams/Locales';

import { Bugsnag } from '@services/Bugsnag';
import '@services/Firebase/AppCheck';
import '@teams/Services/Analytics';
import '@teams/Services/RemoteConfig';
import DeepLinking from '@teams/Services/DeepLinking';

import '@teams/Functions/Team/Subscriptions';
import '@teams/Functions/PushNotifications';
import { getAllUserPreferences } from '@teams/Functions/UserPreferences';

import RenderError from '@views/Information/Errors/Render';

import Routes from '@teams/routes';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import DefaultPrefs from '@teams/Contexts/DefaultPreferences';
import { AuthProvider } from '@teams/Contexts/AuthContext';
import { TeamProvider } from '@teams/Contexts/TeamContext';

import navigationRef from '@teams/References/Navigation';

screens.enableScreens(true);

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);
const { createNavigationContainer } = Bugsnag.getPlugin('reactNavigation');
// The returned BugsnagNavigationContainer has exactly the same usage
// except now it tracks route information to send with your error reports
const BugsnagNavigationContainer =
	createNavigationContainer(NavigationContainer);

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [previousRoute, setPreviousRoute] = useState('Home');

	const [preferences, setPreferences] =
		useState<IUserPreferences>(DefaultPrefs);

	const loadInitialData = useCallback(async () => {
		const prefs = await getAllUserPreferences();

		setPreferences(prefs);

		setIsLoading(false);
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
		<BugsnagNavigationContainer
			ref={navigationRef.setTopLevelNavigator}
			linking={DeepLinking}
			onStateChange={handleOnScreenChange}
		>
			<ErrorBoundary FallbackComponent={RenderError}>
				<PreferencesContext.Provider value={prefes}>
					<ThemeProvider theme={preferences.appTheme}>
						<PaperProvider>
							<AuthProvider>
								<TeamProvider>
									<StatusBar />
									<Routes />

									<AskReview />
								</TeamProvider>
							</AuthProvider>
							<FlashMessage
								duration={7000}
								statusBarHeight={50}
							/>
						</PaperProvider>
					</ThemeProvider>
				</PreferencesContext.Provider>
			</ErrorBoundary>
		</BugsnagNavigationContainer>
	);
};

export default CodePush(App);
