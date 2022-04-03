interface IBrand {
    id: string;
    name: string;
}

interface getAllBrandsProps {
    team_id: string;
}

interface createBrandProps {
    brandName: string;
    team_id: string;
}

interface updateBrandProps {
    brand: IBrand;
    team_id: string;
}

interface deleteBrandProps {
    brand_id: string;
    team_id: string;
}
