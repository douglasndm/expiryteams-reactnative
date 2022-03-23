import { destroySession } from '@utils/Auth/Session';

import strings from '~/Locales';

import { reset } from '~/References/Navigation';
import { clearSelectedteam } from '~/Functions/Team/SelectedTeam';

async function errorsHandler(error: any): Promise<void> {
    let err = '';

    if (error.response) {
        // Request made and server responded

        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);

        if (error.response.data.errorCode) {
            const { errorCode } = error.response.data;
            const { message } = error.response.data;

            if (message) {
                err = message;
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
                    // User is not in team
                    // could be removed or manager deleted the team
                    err = strings.API_Error_Code17;
                    await clearSelectedteam();
                    reset({
                        routesNames: ['TeamList'],
                    });
                    break;
                case 18:
                    err = strings.API_Error_Code18;
                    break;
                case 19:
                    err = strings.API_Error_Code19;
                    break;
                case 20:
                    err = strings.API_Error_Code20;
                    break;
                case 21:
                    err = strings.API_Error_Code21;
                    break;
                case 22:
                    err = strings.API_Error_Code22;
                    break;
                case 23:
                    err = strings.API_Error_Code23;
                    break;
                case 24:
                    err = strings.API_Error_Code24;
                    break;
                case 25:
                    err = strings.API_Error_Code25;
                    break;
                case 26:
                    err = strings.API_Error_Code26;
                    break;
                case 27:
                    err = strings.API_Error_Code27;
                    break;

                default:
                    if (error.response.data.message) {
                        err = message;
                    }
                    break;
            }
        }

        if (error.response.status && error.response.status === 403) {
            await destroySession();
        }

        throw new Error(err);
    } else if (error.request) {
        err = 'Falha ao tentar se conectar ao servidor';

        console.log('The request was made but no response was received');
        console.error(error.request);
    }
    if (error instanceof Error) {
        throw new Error(err);
    } else {
        Promise.reject(error);
    }
}

export default errorsHandler;
