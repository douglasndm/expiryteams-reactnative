import api from '~/Services/API';

export async function getAllBrands({
    team_id,
}: getAllBrandsProps): Promise<Array<IBrand>> {
    const response = await api.get<IBrand[]>(`/team/${team_id}/brands`);

    return response.data;
}

export async function createBrand({
    brandName,
    team_id,
}: createBrandProps): Promise<IBrand> {
    const response = await api.post<IBrand>(`/team/${team_id}/brands`, {
        name: brandName,
        team_id,
    });

    return response.data;
}

export async function updateBrand({
    brand,
    team_id,
}: updateBrandProps): Promise<IBrand> {
    const response = await api.put<IBrand>(`/team/${team_id}/brands`, {
        brand_id: brand.id,
        name: brand.name,
    });

    return response.data;
}

interface getAllProductsByBrandProps {
    team_id: string;
    brand_id: string;
}

export async function getAllProductsByBrand({
    team_id,
    brand_id,
}: getAllProductsByBrandProps): Promise<Array<IProduct>> {
    const response = await api.get<Array<IProduct>>(
        `/team/${team_id}/brands/${brand_id}/products`
    );

    return response.data;
}

export async function deleteBrand({
    brand_id,
    team_id,
}: deleteBrandProps): Promise<void> {
    await api.delete(`/team/${team_id}/brands/${brand_id}`);
}
