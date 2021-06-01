import axios, { AxiosResponse } from 'axios';
import EnvConfig from 'react-native-config';

const api = axios.create({
    baseURL: __DEV__ ? 'http://192.168.1.3:3213' : EnvConfig.API_URL,
});

export function hasResponseError(
    response: AxiosResponse | IAPIError
): response is IAPIError {
    return 'error' in response;
}

export default api;
