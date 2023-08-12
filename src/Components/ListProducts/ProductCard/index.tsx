import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import { useTeam } from '@teams/Contexts/TeamContext';

import { imageExistsLocally, getLocally } from '@utils/Images/GetLocally';
import { saveLocally } from '@utils/Images/SaveLocally';

import Card from '@components/Product/List/Card';

interface Request {
	product: IProduct;
	onLongPress?: () => void;
}

const ProductCard: React.FC<Request> = ({ product, onLongPress }: Request) => {
	const teamContext = useTeam();
	const { preferences } = useContext(PreferencesContext);

	const [imagePath, setImagePath] = useState<string | undefined>();

	const handleImage = useCallback(async () => {
		if (product.code)
			try {
				const existsLocally = await imageExistsLocally(product.code);

				if (existsLocally) {
					const localImage = getLocally(product.code);

					if (Platform.OS === 'android') {
						setImagePath(`file://${localImage}`);
					} else if (Platform.OS === 'ios') {
						setImagePath(localImage);
					}
				} else if (product.thumbnail) {
					setImagePath(product.thumbnail);

					saveLocally(product.thumbnail, product.code.trim());
				}
			} catch (err) {
				setImagePath(undefined);
			}
	}, [product.code, product.thumbnail]);

	useEffect(() => {
		handleImage();
	}, [handleImage]);

	return (
		<Card
			product={product}
			imagePath={imagePath}
			daysToBeNext={preferences.howManyDaysToBeNextToExpire}
			onLongPress={onLongPress}
			storeName={teamContext.roleInTeam?.store?.name || undefined}
		/>
	);
};

export default ProductCard;
