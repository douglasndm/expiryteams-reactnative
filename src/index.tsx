import 'react-native-gesture-handler';
import CodePush, { CodePushOptions } from 'react-native-code-push';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import {
    NavigationContainer,
    getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import Analyticts from '@react-native-firebase/analytics';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from 'react-native-flash-message';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import screens from 'react-native-screens';

import './Locales';

import './Services/Analytics';

import './Functions/Team/Subscriptions';
import './Functions/PushNotifications';
import { getAllUserPreferences } from './Functions/UserPreferences';

import Routes from './Routes/DrawerContainer';

import PreferencesContext from './Contexts/PreferencesContext';

import AskReview from '~/Components/AskReview';
import StatusBar from './Components/StatusBar';

import DefaultPrefs from '~/Contexts/DefaultPreferences';

screens.enableScreens(false);

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [previousRoute, setPreviousRoute] = useState('Home');

    const [preferences, setPreferences] = useState<IPreferences>(DefaultPrefs);

    const loadInitialData = useCallback(async () => {
        const prefs = await getAllUserPreferences();

        setPreferences(prefs);

        SplashScreen.hide();

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

    const onAuthStateChanged = useCallback(
        async (user: FirebaseAuthTypes.User | null) => {
            const prefs = await getAllUserPreferences();

            if (user) {
                setPreferences({
                    ...prefs,
                    user,
                });
            } else {
                setPreferences({
                    ...prefs,
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

    return isLoading ? (
        <ActivityIndicator size="large" />
    ) : (
        <PreferencesContext.Provider
            value={{
                preferences,
                setPreferences,
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
                        <FlashMessage duration={7000} />
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
