import axios from 'axios';
import EnvConfig from 'react-native-config';
import messaging from '@react-native-firebase/messaging';

const api = axios.create({
    baseURL: __DEV__ ? 'http://192.168.1.3:3213' : EnvConfig.API_URL,
});

api.interceptors.request.use(async config => {
    const token = await messaging().getToken();
    config.headers.deviceid = token;

    return config;
});

export default api;
