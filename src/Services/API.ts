import axios from 'axios';
import EnvConfig from 'react-native-config';
import { getBuildNumber, getVersion } from 'react-native-device-info';
import auth from '@react-native-firebase/auth';

import { getDeviceId } from './DeviceID';

import errorsHandler from './API/Errors';

const api = axios.create({
    baseURL: __DEV__ ? EnvConfig.DEV_URL : EnvConfig.API_URL,
});

api.interceptors.request.use(async config => {
    if (config.headers) {
        config.headers.appbuildnumber = getBuildNumber();
        config.headers.appversion = getVersion();

        const device = await getDeviceId();

        config.headers.deviceid = device.device_uuid || '';

        const userToken = await auth().currentUser?.getIdToken();
        config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
});

api.interceptors.response.use(response => response, errorsHandler);

export default api;
