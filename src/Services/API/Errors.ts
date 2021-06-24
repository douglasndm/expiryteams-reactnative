import { showMessage } from 'react-native-flash-message';

import { destroySession } from '~/Functions/Auth/Session';

async function errorsHandler(error: any): Promise<void> {
    if (error.response) {
        // Request made and server responded

        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (error.response.data.message) {
            showMessage({
                message: error.response.data.message,
                type: 'danger',
            });
        }
        if (error.response.data.errorCode) {
            console.log(`erro code -> ${error.response.data.errorCode}`);
        }
        if (error.response.status && error.response.status === 403) {
            console.log(`error code ${error.response.status}`);
            await destroySession();
        }
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    }
    return Promise.reject(error);
}

export default errorsHandler;

/* async error => {
        console.log('inside interceptor');
        // console.log(error.response);
        if (error.response.status && error.response.status === 403) {
            console.log(`error code ${error.response.status}`);
            await destroySession();
        } else {
            return Promise.reject(error);
        }
    }

    */
