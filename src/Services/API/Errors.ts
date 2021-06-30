import { destroySession } from '@utils/Auth/Session';

import strings from '~/Locales';

import { reset } from '~/References/Navigation';

async function errorsHandler(error: any): Promise<void> {
    let knownError = false;
    let err = '';

    if (error.response) {
        // Request made and server responded

        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);

        if (error.response.data.errorCode) {
            const { errorCode } = error.response.data;

            if (errorCode) {
                knownError = true;
            }

            switch (errorCode) {
                case 1:
                    err = strings.API_Error_Code1;
                    break;
                case 2:
                    err = strings.API_Error_Code2;
                    break;
                case 3:
                    err = strings.API_Error_Code3;
                    break;
                case 4:
                    err = strings.API_Error_Code4;
                    break;
                case 5:
                    // Subscription is not active
                    err = strings.API_Error_Code5;
                    reset({
                        routeHandler: 'Routes',
                        routesNames: ['ViewTeam'],
                    });
                    break;
                case 6:
                    err = strings.API_Error_Code6;
                    break;
                case 7:
                    // User was not found
                    err = strings.API_Error_Code7;
                    reset({
                        routesNames: ['Logout'],
                    });
                    break;
                case 8:
                    err = strings.API_Error_Code8;
                    break;
                case 9:
                    err = strings.API_Error_Code9;
                    break;
                case 10:
                    err = strings.API_Error_Code10;
                    break;
                case 11:
                    err = strings.API_Error_Code11;
                    break;
                case 12:
                    err = strings.API_Error_Code12;
                    break;
                case 13:
                    err = strings.API_Error_Code13;
                    break;
                case 14:
                    err = strings.API_Error_Code14;
                    break;
                case 15:
                    err = strings.API_Error_Code15;
                    break;
                case 16:
                    err = strings.API_Error_Code16;
                    break;
                case 17:
                    err = strings.API_Error_Code17;
                    break;

                default:
                    if (error.response.data.message) {
                        console.log('Message from server');
                        console.log(error.response.data.message);
                    }
                    err = 'Error';
                    break;
            }
        }

        if (error.response.status && error.response.status === 403) {
            await destroySession();
        }

        throw new Error(err);
    }
    if (error.request) {
        // The request was made but no response was received
        console.log('request error');
        console.log(error.request);
    }
    if (!knownError) {
        Promise.reject(error);
    }
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
