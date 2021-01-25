/**
 * @format
 */

import { AppRegistry } from 'react-native';
import CodePush from 'react-native-code-push';

import { name as appName } from './app.json';
import App from './src';
import './src/Services/BackgroundJobs';
import './src/Functions/OpenAppTimes';

const codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESUME,
};

AppRegistry.registerComponent(appName, () => CodePush(codePushOptions)(App));
