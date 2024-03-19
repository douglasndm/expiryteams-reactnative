import api from '@services/API';

import errorsHandler from './API/Errors';

api.interceptors.response.use(response => response, errorsHandler);

export default api;
