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
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

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
import { IUserPreferences } from './@types/userPreference';

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

    const [preferences, setPreferences] = useState<IUserPreferences>({
        howManyDaysToBeNextToExpire: 30,
        appTheme: Themes.Light,
        enableNotifications: true,
        enableDrawerMenu: false,
        notificationCadency: NotificationCadency.Day,
        user: {
            id: '',
            name: '',
            lastName: '',
            email: '',
        },
        selectedTeam: {
            role: '',
            team: {
                id: '',
                name: '',
            },
        },
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

    const onAuthStateChanged = useCallback(
        async (user: FirebaseAuthTypes.User | null) => {
            const userPreferences = await getAllUserPreferences();

            if (user) {
                setPreferences({
                    ...userPreferences,
                    enableDrawerMenu: true,
                    user,
                });
            } else {
                setPreferences({
                    ...userPreferences,
                    enableDrawerMenu: true,
                    user: null,
                });
            }
        },
        []
    );

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [onAuthStateChanged]);

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
                        <FlashMessage duration={10000} />
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
