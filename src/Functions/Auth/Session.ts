import api from '@teams/Services/API';
import { getDeviceId } from '@teams/Services/DeviceID';

import { clearSelectedteam } from '../Team/SelectedTeam';
import { logoutFirebase } from './Firebase';

interface SessionResponse {
	id: string;
	name: string | null;
	lastName: string | null;
	firebaseUid: string;
	email: string;
	team?: {
		role: string;
		code: string;
		status: string;
		team: {
			id: string;
			name: string;
			isActive: boolean;
		};
	};
}

async function createSeassion(): Promise<SessionResponse> {
	const deviceId = await getDeviceId();

	let firebaseToken;
	if (deviceId.firebase_messaging) {
		firebaseToken = deviceId.firebase_messaging;
	}

	const response = await api.post<SessionResponse>(`/sessions`, {
		deviceId: deviceId.device_uuid,
		firebaseToken,
	});

	return response.data;
}

export async function destroySession(): Promise<void> {
	await clearSelectedteam();
	await logoutFirebase();
}

export { createSeassion, SessionResponse };
