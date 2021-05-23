import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.3:3213',
});

export function hasResponseError(
    response: AxiosResponse | IAPIError
): response is IAPIError {
    return 'error' in response;
}

export default api;
