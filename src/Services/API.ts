import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:3213',
});

export default api;
