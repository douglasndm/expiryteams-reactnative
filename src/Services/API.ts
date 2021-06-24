import axios from 'axios';
import EnvConfig from 'react-native-config';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import errorsHandler from './API/Errors';

const api = axios.create({
    baseURL: __DEV__ ? 'http://192.168.1.3:3213' : EnvConfig.API_URL,
});

// Function that will be called to refresh authorization
const refreshAuthLogic = failedRequest =>
    auth()
        .currentUser?.getIdToken()
        .then(token => {
            failedRequest.response.config.headers.Authorization = `Bearer ${token}`;
        });

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(api, refreshAuthLogic, {
    statusCodes: [403],
});

api.interceptors.request.use(async config => {
    const token = await messaging().getToken();
    config.headers.deviceid = token;

    return config;
});

api.interceptors.response.use(response => {
    return response;
}, errorsHandler);

export default api;
