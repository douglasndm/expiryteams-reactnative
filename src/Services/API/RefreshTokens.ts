import auth from '@react-native-firebase/auth';

import { createSeassion } from '~/Functions/Auth/Session';

export default async function Refresh(failedRequest): Promise<void> {
    const user = auth().currentUser;

    if (user) {
        const userToken = await user.getIdToken();

        failedRequest.response.config.headers.Authorization = `Bearer ${userToken}`;

        await createSeassion();
    }
}
