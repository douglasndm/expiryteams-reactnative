import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import api from '~/Services/API';

interface importExportFileFromAppProps {
    team_id: string;
}

export async function importExportFileFromApp({
    team_id,
}: importExportFileFromAppProps): Promise<void> {
    try {
        const userSession = auth().currentUser;
        const token = await userSession?.getIdTokenResult();

        const picked = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
        });

        const data = new FormData();
        data.append('file', picked);

        await api.post(`/team/${team_id}/products/import`, data, {
            headers: {
                'Content-Type': 'multipart/form-data; ',
                Authorization: `Bearer ${token?.token}`,
            },
        });
    } catch (err) {
        if (!DocumentPicker.isCancel(err)) {
            throw new Error(err.message);
        }
    }
}
