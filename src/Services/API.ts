import axios from 'axios';

const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1ZWFkYjMwLTVkNmEtNDA2YS1hNjJkLTZkMzVhYjA1YjgzOSIsImlhdCI6MTYyMDM1ODE0MCwiZXhwIjoxNjIwNDQ0NTQwfQ.yTEmfs-b_Sk44X2T-H8-ZuqBh2IXtKz0btvkJYZjYeE';

const api = axios.create({
    baseURL: 'http://127.0.0.1:3213',
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default api;
