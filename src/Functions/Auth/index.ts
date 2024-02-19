import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import strings from '@teams/Locales';

import { loginFirebase } from './Firebase';
import { SessionResponse, createSeassion } from './Session';

interface loginProps {
	email: string;
	password: string;
}

interface IResponse {
	firebaseUser: FirebaseAuthTypes.User;
	localUser: SessionResponse;
}

export async function login({
	email,
	password,
}: loginProps): Promise<IResponse> {
	try {
		const fuser = await loginFirebase({
			email,
			password,
		});

		// Here we register the user device
		const user = await createSeassion();

		const response: IResponse = {
			firebaseUser: fuser,
			localUser: user,
		};

		return response;
	} catch (err) {
		let error = err;

		if (
			err.code === 'auth/wrong-password' ||
			err.code === 'auth/user-not-found'
		) {
			error = strings.View_Login_Error_WrongEmailOrPassword;
		} else if (err.code === 'auth/network-request-failed') {
			error = strings.View_Login_Error_NetworkError;
		} else if (error === 'request error') {
			error = 'Erro de conexão';
		}

		throw new Error(error);
	}
}
