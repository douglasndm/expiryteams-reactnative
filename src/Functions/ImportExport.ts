import DocumentPicker from 'react-native-document-picker';

import api from '~/Services/API';

interface importExportFileFromAppProps {
    team_id: string;
}

export async function importExportFileFromApp({
    team_id,
}: importExportFileFromAppProps): Promise<void> {
    try {
        const picked = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
        });

        const data = new FormData();
        data.append('file', picked[0]);

        await api.post(`/team/${team_id}/products/import`, data, {
            headers: {
                'Content-Type': 'multipart/form-data; ',
            },
        });
    } catch (err) {
        if (!DocumentPicker.isCancel(err) && err instanceof Error) {
            throw new Error(err.message);
        }
    }
}
