import api from '~/Services/API';

export async function getAllBrands({
    team_id,
}: getAllBrandsProps): Promise<Array<IBrand>> {
    const response = await api.get<IBrand[]>(`/brands/team/${team_id}`);

    return response.data;
}

export async function createBrand({
    brandName,
    team_id,
}: createBrandProps): Promise<IBrand> {
    const response = await api.post<IBrand>(`/brand`, {
        name: brandName,
        team_id,
    });

    return response.data;
}

export async function updateBrand(brand: IBrand): Promise<IBrand> {
    const response = await api.put<IBrand>(`/brand`, {
        brand_id: brand.id,
        name: brand.name,
    });

    return response.data;
}

export async function getAllProductsByBrand(
    brand_id: string
): Promise<Array<IProduct>> {
    const response = await api.get<Array<IProduct>>(`/brand/${brand_id}`);

    return response.data;
}

export async function deleteBrand({
    brand_id,
}: deleteBrandProps): Promise<void> {
    await api.delete(`/brand/${brand_id}`);
}

export async function saveManyBrands(brands: Array<IBrand>): Promise<void> {}
