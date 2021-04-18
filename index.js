/**
 * @format
 */

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

AppRegistry.registerComponent(appName, () => App);
