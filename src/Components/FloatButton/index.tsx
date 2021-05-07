import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import { Float, Icons } from './styles';

interface Props {
    navigateTo: 'AddProduct' | 'AddBatch';
    productId?: number; // if is add batch
}

const FloatButton: React.FC<Props> = ({ navigateTo, productId }: Props) => {
    const { navigate } = useNavigation();

    const handleNavigate = useCallback(() => {
        if (navigateTo === 'AddProduct') {
            navigate('AddProduct');
        } else if (navigateTo === 'AddBatch' && !!productId) {
            navigate('AddLote', { productId });
        }
    }, [navigate, navigateTo, productId]);

    const label = useMemo(() => {
        switch (navigateTo) {
            case 'AddProduct':
                return translate('Component_FloatButton_AddProduct');

            case 'AddBatch':
                return translate('Component_FloatButton_AddBatch');

            default:
                return '';
        }
    }, [navigateTo]);

    return (
        <Float
            icon={() => <Icons name="add-outline" color="white" size={22} />}
            small
            label={label}
            onPress={handleNavigate}
        />
    );
};

export default FloatButton;
