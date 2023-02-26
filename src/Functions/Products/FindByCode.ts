import api from '@teams/Services/API';

interface Response {
	name: string;
	code: string;
}

async function findProductByCode(code: string): Promise<Response | null> {
	const response = await api.get<Response>(`/product/${code}`);

	if (response.data !== null) return response.data;

	return null;
}

export { findProductByCode };
