import axios from 'axios';
import EnvConfig from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';

import { destroySession } from '~/Functions/Auth/Session';

const api = axios.create({
    baseURL: __DEV__ ? 'http://192.168.1.3:3213' : EnvConfig.API_URL,
});

api.interceptors.request.use(async config => {
    const token = await messaging().getToken();
    config.headers.deviceid = token;

    // check if user is signed and if it is add token to all future axios requests
    const { currentUser } = auth();
    const authToken = await currentUser?.getIdTokenResult();

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken.token}`;
    }

    return config;
});

api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (error.response.status === 401 || error.response.status === 403) {
            await destroySession();
        } else {
            return Promise.reject(error);
        }
    }
);

export default api;
