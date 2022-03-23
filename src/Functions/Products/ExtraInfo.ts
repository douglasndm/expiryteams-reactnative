import api from '~/Services/API';

interface getExtraInformationsForProductResponse {
    availableBrands: IBrand[];
    availableCategories: ICategory[];
    availableStores: IStore[];
}

interface getExtraInfoForProductsProps {
    team_id: string;
}

async function getExtraInfoForProducts({
    team_id,
}: getExtraInfoForProductsProps): Promise<
    getExtraInformationsForProductResponse
> {
    const response = await api.get<getExtraInformationsForProductResponse>(
        `/team/${team_id}/products/extrainfo`
    );

    return response.data;
}

export { getExtraInfoForProducts };
