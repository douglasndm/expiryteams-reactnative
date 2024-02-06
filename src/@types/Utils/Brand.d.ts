interface IBrand {
	id: string;
	name: string;
}

interface createBrandProps {
	brandName: string;
}

interface updateBrandProps {
	brand: IBrand;
}

interface deleteBrandProps {
	brand_id: string;
}
