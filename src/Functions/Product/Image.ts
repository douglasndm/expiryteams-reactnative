import { Platform } from 'react-native';

import api from '@teams/Services/API';

interface uploadImageProps {
	team_id: string;
	product_id: string;
	path: string;
}
async function uploadImage(props: uploadImageProps): Promise<void> {
	const { team_id, product_id, path } = props;

	// Verificar a plataforma para construir o objeto Blob ou FormData corretamente
	const formData = new FormData();

	const uriParts = path.split('.');
	const fileType = uriParts[uriParts.length - 1];

	const splitedName = path.split('/');

	if (Platform.OS === 'android') {
		const fileUri = `file://${path}`;
		formData.append('image', {
			uri: fileUri,
			name: splitedName[splitedName.length - 1],
			type: `image/${fileType}`,
		});
	} else {
		formData.append('image', {
			uri: path,
			name: splitedName[splitedName.length - 1],
			type: `image/${fileType}`,
		});
	}

	await api.post(
		`/team/${team_id}/upload/product/${product_id}/image`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	);
}

interface removeImageProps {
	team_id: string;
	product_id: string;
}

async function removeImage(props: removeImageProps): Promise<void> {
	await api.delete(
		`/team/${props.team_id}/upload/product/${props.product_id}/image`
	);
}

export { uploadImage, removeImage };
