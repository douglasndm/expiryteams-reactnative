import * as Sentry from '@sentry/react-native';
import 'react-native-gesture-handler';
import CodePush, { CodePushOptions } from 'react-native-code-push';
import React, { useState, useEffect, useCallback } from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import {
    NavigationContainer,
    getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import EnvConfig from 'react-native-config';
import Analyticts from '@react-native-firebase/analytics';
import SplashScreen from 'react-native-splash-screen';

import './Locales';

import './Services/Admob';
import './Services/Analytics';

import './Functions/MultiplesStoresLegacyUsers';
import './Functions/ProMode';
import { getAllUserPreferences } from './Functions/UserPreferences';
import { NotificationCadency } from './Functions/Settings';

import Themes from './Themes';

import Routes from './Routes/DrawerContainer';

import PreferencesContext from './Contexts/PreferencesContext';

import AskReview from '~/Components/AskReview';
import StatusBar from './Components/StatusBar';

if (!__DEV__) {
    Sentry.init({
        dsn: EnvConfig.SENTRY_DSN,
        enableAutoSessionTracking: true,
    });
}

const App: React.FC = () => {
    const [previousRoute, setPreviousRoute] = useState('Home');

    const [preferences, setPreferences] = useState({
        howManyDaysToBeNextToExpire: 30,
        isUserPremium: false,
        appTheme: Themes.Light,
        multiplesStores: false,
        enableNotifications: true,
        notificationCadency: NotificationCadency.Day,
        isUserSignedIn: false,
    });

    useEffect(() => {
        async function getData() {
            const userPreferences = await getAllUserPreferences();

            setPreferences(userPreferences);

            SplashScreen.hide();
        }

        getData();
    }, []);

    const handleOnScreenChange = useCallback(
        async (state) => {
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

    return (
        <PreferencesContext.Provider
            value={{
                userPreferences: preferences,
                setUserPreferences: setPreferences,
            }}
        >
            <ThemeProvider theme={preferences.appTheme}>
                <PaperProvider>
                    <Portal>
                        <NavigationContainer
                            onStateChange={handleOnScreenChange}
                        >
                            <StatusBar />
                            <Routes />

                            <AskReview />
                        </NavigationContainer>
                    </Portal>
                </PaperProvider>
            </ThemeProvider>
        </PreferencesContext.Provider>
    );
};

const codePushOptions: CodePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESUME,
};

export default CodePush(codePushOptions)(App);
