import React, { useContext, useEffect, useState } from 'react';

import PreferencesContext from '@teams/Contexts/PreferencesContext';

import Card from '@components/Product/List/Card';

interface Request {
	product: IProduct;
	onLongPress?: () => void;
}

const ProductCard: React.FC<Request> = ({ product, onLongPress }: Request) => {
	const { preferences } = useContext(PreferencesContext);

	const [imagePath, setImagePath] = useState<string | undefined>();

	useEffect(() => {
		if (product.thumbnail) {
			setImagePath(product.thumbnail);
		}
	}, [product.thumbnail]);

	return (
		<Card
			product={product}
			imagePath={imagePath}
			daysToBeNext={preferences.howManyDaysToBeNextToExpire}
			onLongPress={onLongPress}
		/>
	);
};

export default ProductCard;
