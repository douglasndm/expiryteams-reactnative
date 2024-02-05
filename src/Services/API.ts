import axios from 'axios';
import EnvConfig from 'react-native-config';
import { getBuildNumber, getVersion } from 'react-native-device-info';
import crashlytics from '@react-native-firebase/crashlytics';
import auth from '@react-native-firebase/auth';
import appCheck from '@react-native-firebase/app-check';

import { getDeviceId } from './DeviceID';

import errorsHandler from './API/Errors';

const api = axios.create({
	baseURL: __DEV__ ? EnvConfig.DEV_URL : EnvConfig.API_URL,
});

api.interceptors.request.use(async config => {
	if (config.headers) {
		config.headers.appbuildnumber = getBuildNumber();
		config.headers.appversion = getVersion();

		try {
			const device = await getDeviceId();
			config.headers.deviceid = device.device_uuid || '';

			const userToken = await auth().currentUser?.getIdToken();
			config.headers.Authorization = `Bearer ${userToken}`;

			const { token } = await appCheck().getToken();
			config.headers['X-Firebase-AppCheck'] = token;
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				crashlytics().recordError(error);
			}
		}
	}
	return config;
});

api.interceptors.response.use(response => response, errorsHandler);

export default api;
