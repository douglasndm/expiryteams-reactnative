import axios from 'axios';
import EnvConfig from 'react-native-config';
import { getBuildNumber, getVersion } from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import errorsHandler from './API/Errors';

const api = axios.create({
    baseURL: __DEV__ ? 'http://localhost:3213' : EnvConfig.API_URL,
});

api.interceptors.request.use(async config => {
    config.headers.appbuildnumber = getBuildNumber();
    config.headers.appversion = getVersion();

    const token = await messaging().getToken();
    config.headers.deviceid = token;

    const userToken = await auth().currentUser?.getIdToken();
    config.headers.Authorization = `Bearer ${userToken}`;

    return config;
});

api.interceptors.response.use(response => response, errorsHandler);

export default api;
