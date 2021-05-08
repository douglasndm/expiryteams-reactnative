import 'react-native-gesture-handler';
import CodePush, { CodePushOptions } from 'react-native-code-push';
import React, { useState, useEffect, useCallback } from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import {
    NavigationContainer,
    getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import Analyticts from '@react-native-firebase/analytics';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';

import './Locales';

import './Services/Analytics';

import './Functions/PushNotifications';
import { getAllUserPreferences } from './Functions/UserPreferences';
import { NotificationCadency } from './Functions/Settings';

import Themes from './Themes';

import Routes from './Routes/DrawerContainer';

import PreferencesContext from './Contexts/PreferencesContext';

import AskReview from '~/Components/AskReview';
import StatusBar from './Components/StatusBar';

async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        announcement: true,
        sound: true,
    });

    if (authorizationStatus) {
        console.log('Permission status:', authorizationStatus);
    }
}

const App: React.FC = () => {
    requestUserPermission();

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

    const loadInitialData = useCallback(async () => {
        const userPreferences = await getAllUserPreferences();

        setPreferences(userPreferences);

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
    }, [loadInitialData]);

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
    mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
